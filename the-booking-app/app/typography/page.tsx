export default function TypographyPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="heading-xl mb-8">Typography System</h1>

      <section className="mb-16">
        <h2 className="heading-lg mb-6">Display</h2>
        <div className="space-y-8">
          <div>
            <p className="text-sm text-muted-foreground mb-2">display-2xl</p>
            <p className="display-2xl">The quick brown fox jumps over the lazy dog</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">display-xl</p>
            <p className="display-xl">The quick brown fox jumps over the lazy dog</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">display-lg</p>
            <p className="display-lg">The quick brown fox jumps over the lazy dog</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">display-md</p>
            <p className="display-md">The quick brown fox jumps over the lazy dog</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">display-sm</p>
            <p className="display-sm">The quick brown fox jumps over the lazy dog</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">display-xs</p>
            <p className="display-xs">The quick brown fox jumps over the lazy dog</p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="heading-lg mb-6">Headings</h2>
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">heading-2xl (h1)</p>
            <h1>The quick brown fox jumps over the lazy dog</h1>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">heading-xl (h2)</p>
            <h2>The quick brown fox jumps over the lazy dog</h2>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">heading-lg (h3)</p>
            <h3>The quick brown fox jumps over the lazy dog</h3>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">heading-md (h4)</p>
            <h4>The quick brown fox jumps over the lazy dog</h4>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">heading-sm (h5)</p>
            <h5>The quick brown fox jumps over the lazy dog</h5>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">heading-xs (h6)</p>
            <h6>The quick brown fox jumps over the lazy dog</h6>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="heading-lg mb-6">Titles</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">title-lg</p>
            <p className="title-lg">The quick brown fox jumps over the lazy dog</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">title-md</p>
            <p className="title-md">The quick brown fox jumps over the lazy dog</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">title-sm</p>
            <p className="title-sm">The quick brown fox jumps over the lazy dog</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">title-xs</p>
            <p className="title-xs">The quick brown fox jumps over the lazy dog</p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="heading-lg mb-6">Body Text</h2>
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">body-xl (lead)</p>
            <p className="lead">
              The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
              vel massa eget libero finibus tincidunt.
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">body-lg</p>
            <p className="body-lg">
              The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
              vel massa eget libero finibus tincidunt.
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">body-md (default paragraph)</p>
            <p>
              The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
              vel massa eget libero finibus tincidunt.
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">body-sm (small)</p>
            <p className="small">
              The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
              vel massa eget libero finibus tincidunt.
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">body-xs (caption)</p>
            <p className="caption">
              The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="heading-lg mb-6">Labels</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">label-lg</p>
            <p className="label-lg">THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">label-md (overline)</p>
            <p className="overline">THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">label-sm</p>
            <p className="label-sm">THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG</p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="heading-lg mb-6">Example Content</h2>
        <div className="prose max-w-none">
          <h1>Medical Booking Platform</h1>
          <p className="lead">
            Streamline your clinic's appointment scheduling with our comprehensive booking solution.
          </p>

          <h2>Features for Clinics</h2>
          <p>
            Our platform offers a range of features designed specifically for medical clinics. From appointment
            scheduling to patient management, we've got you covered.
          </p>

          <h3>Appointment Management</h3>
          <p>
            Easily manage appointments with our intuitive calendar interface. View daily, weekly, or monthly schedules
            at a glance.
          </p>

          <h4>Smart Scheduling</h4>
          <p>
            Our AI-powered scheduling system helps optimize your clinic's time and resources, reducing wait times and
            improving patient satisfaction.
          </p>

          <h5>Automated Reminders</h5>
          <p>Reduce no-shows with automated SMS and email reminders sent to patients before their appointments.</p>

          <h6>Customizable Templates</h6>
          <p className="body-sm">Create custom reminder templates that match your clinic's voice and branding.</p>

          <p className="overline mt-8">Patient Experience</p>
          <h3>Seamless Booking Experience</h3>
          <p>Patients can easily book appointments online, selecting their preferred doctor, date, and time slot.</p>

          <div className="bg-muted p-4 rounded-md mt-6">
            <p className="caption mb-0">
              Note: The BookingLink platform is HIPAA compliant and ensures the security of all patient data.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
