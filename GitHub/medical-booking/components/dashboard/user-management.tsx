"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
} from "@mui/material"
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/router"
import { clientAuditService } from "@/services/audit-service-client"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
  })
  const [clinicId, setClinicId] = useState("")
  const { authUser } = useAuth()
  const router = useRouter()
  const [alert, setAlert] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  })

  useEffect(() => {
    if (authUser) {
      setClinicId(authUser.clinicId)
      fetchUsers(authUser.clinicId)
    }
  }, [authUser])

  const fetchUsers = async (clinicId: string) => {
    try {
      const response = await fetch(`/api/clinics/${clinicId}/users`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setUsers(data)
      await clientAuditService.logAction(clinicId, {
        action: "view",
        resource: "staff",
        details: "Viewed user list",
      })
    } catch (error: any) {
      console.error("Failed to fetch users:", error)
      setAlert({ open: true, message: `Failed to fetch users: ${error.message}`, severity: "error" })
    }
  }

  const handleOpenDialog = () => {
    setOpenDialog(true)
    setEditingUser(null)
    setFormData({ firstName: "", lastName: "", email: "", role: "", password: "" })
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async () => {
    try {
      const method = editingUser ? "PUT" : "POST"
      const url = editingUser ? `/api/clinics/${clinicId}/users/${editingUser.id}` : `/api/clinics/${clinicId}/users`

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to ${editingUser ? "update" : "create"} user`)
      }

      const result = await response.json()

      await clientAuditService.logAction(clinicId, {
        action: editingUser ? "update" : "create",
        resource: "staff",
        resourceId: editingUser?.id || result.userId,
        details: `${editingUser ? "Updated" : "Created"} user: ${formData.firstName} ${formData.lastName}`,
      })

      fetchUsers(clinicId)
      handleCloseDialog()
      setAlert({
        open: true,
        message: `User ${editingUser ? "updated" : "created"} successfully!`,
        severity: "success",
      })
    } catch (error: any) {
      console.error(`Failed to ${editingUser ? "update" : "create"} user:`, error)
      setAlert({
        open: true,
        message: `Failed to ${editingUser ? "update" : "create"} user: ${error.message}`,
        severity: "error",
      })
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({ ...user, password: "" })
    setOpenDialog(true)
  }

  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(`/api/clinics/${clinicId}/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.status}`)
      }

      fetchUsers(clinicId)
      setAlert({ open: true, message: "User deleted successfully!", severity: "success" })
      await clientAuditService.logAction(clinicId, {
        action: "delete",
        resource: "staff",
        resourceId: userId,
        details: `Deleted user ID: ${userId}`,
      })
    } catch (error: any) {
      console.error("Failed to delete user:", error)
      setAlert({ open: true, message: `Failed to delete user: ${error.message}`, severity: "error" })
    }
  }

  const handleCloseAlert = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return
    }
    setAlert({ ...alert, open: false })
  }

  if (!authUser) {
    return null // Or a loading indicator
  }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpenDialog}>
        Add User
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {user.firstName}
                </TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(user)}>
                    <EditIcon />
                  </Button>
                  <Button onClick={() => handleDelete(user.id)}>
                    <DeleteIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="firstName"
            label="First Name"
            type="text"
            fullWidth
            variant="standard"
            value={formData.firstName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="lastName"
            label="Last Name"
            type="text"
            fullWidth
            variant="standard"
            value={formData.lastName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={formData.email}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="role-label">Role</InputLabel>
            <Select labelId="role-label" name="role" value={formData.role} label="Role" onChange={handleInputChange}>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            onChange={handleInputChange}
            helperText={editingUser ? "Leave blank to keep current password" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit}>{editingUser ? "Update" : "Create"}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default UserManagement
