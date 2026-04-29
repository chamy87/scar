import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"

export function LoginPage() {
  const { signIn, sendMagicLink, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [magicLoading, setMagicLoading] = useState(false)
  const [magicSent, setMagicSent] = useState("")
  const backTo = (location.state as { from?: string } | undefined)?.from ?? "/dashboard"

  useEffect(() => { if (isAuthenticated) navigate(backTo) }, [isAuthenticated, navigate, backTo])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await signIn(email, password)
      navigate("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to login")
    } finally {
      setLoading(false)
    }
  }

  const sendLink = async () => {
    if (!email) {
      setError("Enter an email first.")
      return
    }
    setMagicLoading(true)
    setError("")
    setMagicSent("")
    try {
      await sendMagicLink(email, "https://scarlettox.com/dashboard")
      setMagicSent("Magic link sent. Check your email.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send magic link")
    } finally {
      setMagicLoading(false)
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-border-soft bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-scarlet-deep">Scarlett&apos;s Pediatric Tracker</h2>
      <p className="mb-4 text-sm text-text-muted">Secure access for updating readings and patient information.</p>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full rounded-xl border border-border-soft p-2" type="email" placeholder="Email" required value={email} onChange={(x) => setEmail(x.target.value)} />
        <input className="w-full rounded-xl border border-border-soft p-2" type="password" placeholder="Password" required value={password} onChange={(x) => setPassword(x.target.value)} />
        {error && <p className="text-sm text-accent-rose">{error}</p>}
        {magicSent && <p className="text-sm text-emerald-700">{magicSent}</p>}
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Login"}</Button>
        <Button type="button" className="w-full bg-scarlet-deep" disabled={magicLoading} onClick={sendLink}>
          {magicLoading ? "Sending link..." : "Send Magic Link"}
        </Button>
      </form>
      <Link to="/dashboard" className="mt-3 block text-center text-sm text-scarlet-primary">Back to dashboard</Link>
    </div>
  )
}
