import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Build a Pre-Launch Email List That Actually Converts | WaitlistKit',
  description: 'Learn how to build a pre-launch email list that converts subscribers into paying customers. Strategies for launch waitlists, email capture, and engagement.',
  keywords: 'pre-launch email list, launch waitlist, email capture, pre-launch marketing, product launch email',
  openGraph: {
    title: 'How to Build a Pre-Launch Email List That Actually Converts',
    description: 'Learn how to build a pre-launch email list that converts subscribers into paying customers.',
    type: 'article',
    publishedTime: '2026-02-04',
  },
}

export default function PreLaunchEmailListPage() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-16">
      {/* Article Header */}
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">
            Growth
          </span>
          <span className="text-gray-500">February 4, 2026</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-500">11 min read</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          How to Build a Pre-Launch Email List That Actually Converts
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Most pre-launch email lists are graveyards of forgotten signups. Here&apos;s how to build one that turns subscribers into launch day customers—and long-term advocates.
        </p>
      </header>

      {/* Article Content */}
      <div className="prose prose-lg prose-gray max-w-none">
        <p className="text-gray-700 leading-relaxed mb-6">
          Here&apos;s a scenario that plays out thousands of times each year: A founder launches a &quot;coming soon&quot; page, collects a few hundred emails, and gets excited about launch day. Then the day arrives. They send the big announcement. Opens are decent, clicks are okay, but conversions? Barely a trickle.
        </p>

        <p className="text-gray-700 leading-relaxed mb-6">
          The problem isn&apos;t the product. The problem is the list. More specifically, the problem is how that list was built and maintained in the weeks or months before launch.
        </p>

        <p className="text-gray-700 leading-relaxed mb-8">
          A high-converting pre-launch email list isn&apos;t just a collection of addresses—it&apos;s a community of engaged potential customers who feel invested in your success. Building that takes strategy, not just a signup form.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
          The Psychology of Pre-Launch Subscribers
        </h2>

        <p className="text-gray-700 leading-relaxed mb-6">
          Understanding why people join pre-launch lists is the first step to converting them. Subscribers typically fall into one of four categories:
        </p>

        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-gray-900">🔥 The Early Adopters (10-15%)</p>
              <p className="text-gray-700">These people actively seek out new products. They&apos;ll buy almost anything interesting on launch day. They&apos;re your easiest conversions.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">🤔 The Curious (40-50%)</p>
              <p className="text-gray-700">They saw your page, thought it was interesting, and signed up to learn more. They might convert with the right messaging and timing.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">💤 The Passive (25-35%)</p>
              <p className="text-gray-700">They signed up on a whim and probably forgot about you. Re-engagement is possible but difficult.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">👻 The Ghosts (10-15%)</p>
              <p className="text-gray-700">Fake emails, abandoned inboxes, and bots. They&apos;ll never convert because they were never real.</p>
            </div>
          </div>
        </div>

        <p className="text-gray-700 leading-relaxed mb-6">
          Your job is to move people up this pyramid. Convert the Curious into Early Adopters. Wake up the Passive. And accept that the Ghosts are sunk cost—don&apos;t waste energy on them.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
          Phase 1: Acquisition (Getting the Right Emails)
        </h2>

        <p className="text-gray-700 leading-relaxed mb-6">
          Not all subscribers are created equal. A hundred highly-engaged emails outperform a thousand random signups. Here&apos;s how to attract the right people from the start.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
          Create Genuine Curiosity, Not False Urgency
        </h3>

        <p className="text-gray-700 leading-relaxed mb-6">
          &quot;Join 10,000+ others!&quot; and &quot;Don&apos;t miss out!&quot; are empty phrases. People are numb to them. Instead, focus on specific value:
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-red-50 rounded-lg p-4">
            <p className="font-semibold text-red-700 mb-2">❌ Weak</p>
            <ul className="text-gray-700 space-y-1 text-sm">
              <li>• &quot;Sign up for updates&quot;</li>
              <li>• &quot;Be the first to know&quot;</li>
              <li>• &quot;Coming soon - join the waitlist&quot;</li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="font-semibold text-green-700 mb-2">✅ Strong</p>
            <ul className="text-gray-700 space-y-1 text-sm">
              <li>• &quot;Get 50% off when we launch (first 100 only)&quot;</li>
              <li>• &quot;Early access to features we&apos;re not announcing publicly&quot;</li>
              <li>• &quot;Join our founding member community&quot;</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
          Qualify Your Signups
        </h3>

        <p className="text-gray-700 leading-relaxed mb-6">
          Adding one optional question to your signup form dramatically improves list quality. Ask something relevant:
        </p>

        <ul className="text-gray-700 space-y-2 mb-6 ml-6">
          <li>• &quot;What&apos;s your biggest challenge with [problem you solve]?&quot;</li>
          <li>• &quot;How many [relevant metric] do you currently manage?&quot;</li>
          <li>• &quot;What tools are you currently using for this?&quot;</li>
        </ul>

        <p className="text-gray-700 leading-relaxed mb-6">
          People who take time to answer are more engaged. You also gather valuable customer research for free.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
          Build Referral Mechanics From Day One
        </h3>

        <p className="text-gray-700 leading-relaxed mb-6">
          A waitlist with referral tracking turns every subscriber into a potential recruiter. When someone joins, show them their position and explain they can move up by inviting friends. Tools like <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">WaitlistKit</Link> make this trivial to implement—each user gets a unique referral link automatically.
        </p>

        <p className="text-gray-700 leading-relaxed mb-6">
          The referral factor matters because referred subscribers convert at 2-3x the rate of random signups. They came because someone they trust vouched for you.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
          Phase 2: Engagement (Keeping Them Warm)
        </h2>

        <p className="text-gray-700 leading-relaxed mb-6">
          The time between signup and launch is where most waitlists fail. Weeks of silence, then a sudden &quot;WE&apos;RE LIVE!&quot; email to people who forgot they signed up. Here&apos;s the alternative.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
          The Minimum Viable Engagement Sequence
        </h3>

        <p className="text-gray-700 leading-relaxed mb-6">
          At minimum, send one email per week during your pre-launch period. Here&apos;s a framework:
        </p>

        <div className="bg-indigo-50 rounded-xl p-6 mb-8">
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-gray-900">Email 1: Welcome (Immediate)</p>
              <p className="text-gray-700">Confirm signup, set expectations, share the vision. Include their position and referral link.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Email 2: The Problem (Day 3)</p>
              <p className="text-gray-700">Deep dive into the problem you&apos;re solving. Share data, stories, or examples. Validate their pain.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Email 3: Behind the Scenes (Day 7)</p>
              <p className="text-gray-700">Show them you&apos;re building. Screenshots, progress updates, team photos. Make it real.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Email 4: Community (Day 14)</p>
              <p className="text-gray-700">Invite them to contribute. Survey, beta applications, or just asking for feedback.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Email 5+: Ongoing Updates (Weekly)</p>
              <p className="text-gray-700">Mix of progress, value-add content, and reminders about referral rewards.</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
          Content That Keeps People Engaged
        </h3>

        <p className="text-gray-700 leading-relaxed mb-6">
          Not every email needs to be about your product. In fact, the best pre-launch sequences mix promotional content with genuine value:
        </p>

        <ul className="text-gray-700 space-y-2 mb-6 ml-6">
          <li><span className="font-semibold">Educational content:</span> Teach them something related to your problem space</li>
          <li><span className="font-semibold">Founder stories:</span> Why you&apos;re building this, what you&apos;ve learned</li>
          <li><span className="font-semibold">Industry insights:</span> Trends, data, or analysis they can&apos;t get elsewhere</li>
          <li><span className="font-semibold">Beta access:</span> Let some subscribers try early versions and share feedback</li>
          <li><span className="font-semibold">Exclusive previews:</span> Features, designs, or announcements they see first</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
          Create Two-Way Conversations
        </h3>

        <p className="text-gray-700 leading-relaxed mb-6">
          Don&apos;t just broadcast—engage. Ask questions and actually respond to replies. The founders who reply personally to pre-launch subscribers build loyalty that lasts. It doesn&apos;t scale forever, but in the early days, those personal connections compound.
        </p>

        <p className="text-gray-700 leading-relaxed mb-6">
          Some specific tactics:
        </p>

        <ul className="text-gray-700 space-y-2 mb-8 ml-6">
          <li>• End every email with a question</li>
          <li>• Create a private Discord or Slack for super-engaged subscribers</li>
          <li>• Host live Q&amp;A sessions (even with tiny audiences)</li>
          <li>• Let subscribers vote on product decisions</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
          Phase 3: Conversion (Launch Day and Beyond)
        </h2>

        <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
          Build Launch Day Anticipation
        </h3>

        <p className="text-gray-700 leading-relaxed mb-6">
          Don&apos;t surprise people with launch. Build up to it:
        </p>

        <ul className="text-gray-700 space-y-2 mb-6 ml-6">
          <li><span className="font-semibold">T-14 days:</span> Announce the date. Remind them of their position and referral rewards.</li>
          <li><span className="font-semibold">T-7 days:</span> Share what&apos;s included at launch. Get them excited about specifics.</li>
          <li><span className="font-semibold">T-3 days:</span> Countdown begins. This is the last chance to refer and unlock rewards.</li>
          <li><span className="font-semibold">T-1 day:</span> &quot;Tomorrow&apos;s the day.&quot; Include exact timing and what to expect.</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
          The Launch Email Sequence
        </h3>

        <p className="text-gray-700 leading-relaxed mb-6">
          One launch email isn&apos;t enough. Open rates for any single email rarely exceed 40%. Send a sequence:
        </p>

        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-gray-900">Email 1 (Launch Hour)</p>
              <p className="text-gray-700">&quot;We&apos;re Live!&quot; — Excitement, key benefits, clear CTA</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Email 2 (Launch Day +6 hours)</p>
              <p className="text-gray-700">Early results, social proof, urgency for limited offers</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Email 3 (Day 2)</p>
              <p className="text-gray-700">Different angle, address common objections, testimonials</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Email 4 (Day 4)</p>
              <p className="text-gray-700">Last chance for launch pricing/bonuses</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
          Reward Your Champions
        </h3>

        <p className="text-gray-700 leading-relaxed mb-6">
          If you promised rewards for referrals, deliver them immediately and publicly. Send a special email to your top referrers thanking them by name. This validates the system and encourages future sharing.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
          Metrics That Matter
        </h2>

        <p className="text-gray-700 leading-relaxed mb-6">
          Track these throughout your pre-launch period:
        </p>

        <div className="bg-indigo-50 rounded-xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="font-semibold text-gray-900 mb-2">Acquisition Metrics</p>
              <ul className="text-gray-700 space-y-1">
                <li>• Signup rate (visitors → subscribers)</li>
                <li>• Referral coefficient (signups per subscriber)</li>
                <li>• Traffic sources (which channels convert best)</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-2">Engagement Metrics</p>
              <ul className="text-gray-700 space-y-1">
                <li>• Email open rates (&gt;40% is good)</li>
                <li>• Click rates (&gt;5% is good)</li>
                <li>• Reply rate (any is great)</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-gray-700 leading-relaxed mb-6">
          If open rates drop below 25%, you have an engagement problem. If signup rates are low, your landing page needs work. If referral rates are zero, your incentives aren&apos;t compelling enough.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
          Common Mistakes to Avoid
        </h2>

        <div className="bg-red-50 rounded-xl p-6 mb-8">
          <ul className="text-gray-700 space-y-4">
            <li>
              <span className="font-semibold text-red-700">Going silent:</span> The #1 killer of pre-launch conversions. If you don&apos;t have anything to say, say that—&quot;Quick update: still building, here&apos;s where we are.&quot;
            </li>
            <li>
              <span className="font-semibold text-red-700">Waiting too long to launch:</span> Momentum decays exponentially. Launch in weeks, not months.
            </li>
            <li>
              <span className="font-semibold text-red-700">No segmentation:</span> Your super-engaged subscribers should get different content than cold signups.
            </li>
            <li>
              <span className="font-semibold text-red-700">Ignoring mobile:</span> Most emails are opened on phones. Optimize for thumb-scrolling.
            </li>
            <li>
              <span className="font-semibold text-red-700">Generic messaging:</span> &quot;We&apos;re launching a revolutionary solution&quot; means nothing. Be specific.
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
          Putting It All Together
        </h2>

        <p className="text-gray-700 leading-relaxed mb-6">
          A pre-launch email list that converts isn&apos;t about size—it&apos;s about relationship. Every email is either building or eroding trust. Every touchpoint either warms people up or lets them cool down.
        </p>

        <p className="text-gray-700 leading-relaxed mb-6">
          The founders who nail pre-launch marketing treat their waitlist like their first customers—because they are. They share openly, engage genuinely, and deliver on their promises.
        </p>

        <p className="text-gray-700 leading-relaxed mb-8">
          Start with the right tools (referral tracking, automation, analytics), execute the basics (regular emails, clear value, referral mechanics), and focus on genuine connection. Do that, and your launch day conversion rates will make other founders jealous.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-10 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Start Building Your Pre-Launch List Today</h2>
        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          WaitlistKit includes everything you need: email capture, referral tracking, position queuing, and analytics. Free to start.
        </p>
        <Link
          href="/pricing"
          className="inline-block bg-white text-indigo-600 font-bold py-3 px-8 rounded-xl hover:bg-gray-100 transition"
        >
          Create Your Waitlist →
        </Link>
      </div>

      {/* Related Posts */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/blog/how-to-build-viral-waitlist" className="block group">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <span className="text-indigo-600 text-sm font-medium">Strategy</span>
              <h4 className="text-lg font-bold text-gray-900 mt-2 group-hover:text-indigo-600 transition">
                How to Build a Viral Waitlist: The Complete 2026 Guide
              </h4>
            </div>
          </Link>
          <Link href="/blog/referral-waitlist-growth" className="block group">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <span className="text-indigo-600 text-sm font-medium">Referrals</span>
              <h4 className="text-lg font-bold text-gray-900 mt-2 group-hover:text-indigo-600 transition">
                Referral Waitlists: How to 10x Your Signups With Built-In Virality
              </h4>
            </div>
          </Link>
        </div>
      </div>
    </article>
  )
}
