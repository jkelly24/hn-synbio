export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose max-w-none">
        <p className="text-gray-600 mb-6">
          Last updated: July 22, 2025
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <p className="mb-4">
            When you create an account on SynBioNews, we collect:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Email address (for account creation and authentication)</li>
            <li>Username/handle (publicly visible)</li>
            <li>Password (securely hashed using bcrypt)</li>
            <li>Posts, comments, and votes you submit</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <p className="mb-4">
            We use your information to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide and maintain the service</li>
            <li>Authenticate your account</li>
            <li>Display your posts and comments</li>
            <li>Calculate rankings and scores</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
          <p className="mb-4">
            We implement appropriate security measures to protect your personal information:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Passwords are hashed using bcrypt</li>
            <li>HTTPS encryption for all communications</li>
            <li>Secure database hosting with Supabase</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
          <p className="mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your account</li>
            <li>Export your data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us through our platform.
          </p>
        </section>
      </div>
    </div>
  )
}
