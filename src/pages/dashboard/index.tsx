import { Button } from "@/components/ui/button"

const DashboardPage = () => {
  return (
    <div>
      <h1 className="text-4xl font-semibold mb-6">Get Started</h1>
      <p className="text-muted-foreground">
        Welcome to your Maintainerd Auth dashboard. Here you can manage your authentication services,
        users, and security settings.
      </p>

      {/* Dashboard content will go here */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">1,234</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">Active Sessions</h3>
          <p className="text-3xl font-bold text-green-600">567</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">API Calls Today</h3>
          <p className="text-3xl font-bold text-purple-600">8,901</p>
        </div>
      </div>

      {/* Setup Application Section */}
      <div className="mt-8">
        <h2 className="text-xl font-medium mb-4">Setup Application</h2>

        <div className="border rounded-lg p-6 bg-card">
          <h3 className="text-lg font-semibold mb-2">Integrate M9d-Auth into your application</h3>
          <p className="text-muted-foreground mb-4">
            Integrate M9d-Auth into your application or use one of our samples to get started in minutes.
          </p>
          <div className="flex items-center gap-4">
            <Button>Create Application</Button>
            <a href="#" className="text-blue-600 hover:text-blue-800 underline">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage;
