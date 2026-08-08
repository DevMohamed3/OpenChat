import { getCurrentUser } from '@/lib/getCurrentUser'
import Navbar from 'packages/ui/ui/Navbar'
import Footer from '../Footer'

export default async function TermsPage() {
  const user = await getCurrentUser()

  return (
    <div className="dark min-h-screen bg-background">
      <Navbar user={user} />
      <main className="max-w-3xl mx-auto px-6 pt-40 pb-24">
        <h1 className="font-display text-4xl md:text-5xl font-normal tracking-tight text-white mb-4">Terms of Service</h1>

        <p className="text-zinc-500 mb-12 text-sm">
          Last updated: February 2026
        </p>

        <div className="space-y-10 text-sm leading-relaxed text-zinc-400">

        <section>
          <h2 className="font-display text-2xl font-normal tracking-tight text-white mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using ZeroZone, you agree to be bound
            by these Terms of Service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-normal tracking-tight text-white mb-3">2. Use of Service</h2>
          <p>You agree to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Use the platform responsibly</li>
            <li>Comply with applicable laws</li>
            <li>Respect other users</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-normal tracking-tight text-white mb-3">3. Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality
            of your account credentials and for all activity under your account.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-normal tracking-tight text-white mb-3">4. User Content</h2>
          <p>
            You retain ownership of the content you create.
            By using ZeroZone, you grant us a limited license
            to host and display that content for service operation.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-normal tracking-tight text-white mb-3">5. Prohibited Activities</h2>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Attempting to disrupt or hack the platform</li>
            <li>Spreading malware or harmful code</li>
            <li>Harassing or abusing other users</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-normal tracking-tight text-white mb-3">6. Termination</h2>
          <p>
            We reserve the right to suspend or terminate accounts
            that violate these Terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-normal tracking-tight text-white mb-3">7. Disclaimer</h2>
          <p>
            The service is provided "as is" without warranties
            of any kind, express or implied.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-normal tracking-tight text-white mb-3">8. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time.
            Continued use of ZeroZone means acceptance of changes.
          </p>
        </section>

      </div>
      </main>
      <Footer />
    </div>
  )
}
