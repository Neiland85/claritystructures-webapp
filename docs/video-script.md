# 90-Second Video Script: Decision Engine Positioning

## 10-second hook
If your system makes operational decisions, you need more than speed.
You need decisions you can reproduce, explain, and defend months later.

## 30-second explanation
We built the Decision Engine as a deterministic, versioned policy layer.
Version 1 is snapshot-locked, so baseline behavior is stable over time.
Version 2 evolves in a controlled way by refining V1 only when additional structured signals exist.
Each output includes an explicit model version, so every decision is traceable to a specific policy contract.
And explainability is built in: reasons are constrained to a defined contract, not generated as free-form commentary.

## 30-second demo walkthrough
Here’s a simple walkthrough.
First, we submit an intake payload to V1 and capture the decision output.
Then we run the same payload through V2 with no extra signals and get the same baseline outcome.
Next, we add a structured signal and V2 applies a bounded refinement.
In all cases, the response includes both the model version and explicit decision reasons.
So reviewers can see what changed, why it changed, and which version executed.

## 20-second positioning close
This is not machine learning, and it is not black-box scoring.
It is explicit policy engineering with version discipline, deterministic execution, and explainability by contract.
For regulated and compliance-driven systems, that makes the engine an architectural asset, not just a feature.
