const SCRIPT_TEXT_REPAIRS: Array<[string, string]> = [
  ["This provider hasn't submitted KYC documents yet.", 'This provider has not submitted KYC documents yet.'],
  ["This provider hasn\\'t submitted KYC documents yet.", 'This provider has not submitted KYC documents yet.'],
  ["Review takes 24-48 hrs. We'll email you.", 'Review takes 24-48 hrs. We will email you.'],
  ["Review takes 24-48 hrs. We\\'ll email you.", 'Review takes 24-48 hrs. We will email you.'],
  ["Review takes 24\u201348 hrs. We'll email you.", 'Review takes 24-48 hrs. We will email you.'],
  ["Review takes 24\u201348 hrs. We\\'ll email you.", 'Review takes 24-48 hrs. We will email you.'],
  ["e.response?.data?.error||'Failed to save'", "e.response && e.response.data && e.response.data.error ? e.response.data.error : 'Failed to save'"],
  ["e.response?.data?.error || 'Failed to save'", "e.response && e.response.data && e.response.data.error ? e.response.data.error : 'Failed to save'"],
]

export function repairInlineScriptText(html: string): string {
  return SCRIPT_TEXT_REPAIRS.reduce(
    (next, [broken, fixed]) => next.split(broken).join(fixed),
    html,
  )
}
