# Reflection: SDD vs Traditional Development

Spec-Driven Development (SDD) changed the way this POS frontend was approached. In a traditional flow, development often starts quickly with UI components and only later tries to formalize requirements. That usually creates rework because assumptions made early are not always shared by everyone. With SDD, the order is inverted: first define what to build (`requirements.md`), then how it should be structured (`design.md`), and only then execute through explicit tasks (`tasks.md`).

The main difference I noticed is clarity of intent. Writing user stories and acceptance criteria forced concrete definitions for behaviors like barcode scanning fallback, tax and discount calculations, and payment validation. In a traditional approach, these details are sometimes implicit and become bugs discovered late. In SDD, they are explicit and testable from the beginning.

Another benefit is traceability. When a feature appears in code, it can be mapped back to a requirement and a task. This makes review easier, because the question changes from "does this code look good?" to "does this satisfy the acceptance criteria?". It also helps when iterating: if behavior is wrong, the spec can be corrected first, then implementation follows.

SDD also improves collaboration with AI tools. Instead of a vague prompt like "build a POS app," the agent receives structured constraints and priorities. This reduces random output and increases consistency in architecture and naming. The quality of generated code is directly tied to the quality of the spec, which makes specification writing a core engineering activity, not just documentation.

There are tradeoffs. SDD has an upfront cost: writing and refining specs takes time before visible UI progress. For very small or exploratory prototypes, this can feel slower. It also requires discipline to keep specs updated when scope changes. If specs become stale, they can mislead implementation.

Overall, for this workshop and for production-like features, SDD provided better predictability and less rework than a traditional code-first flow. It made requirements testable, architecture intentional, and implementation more reliable, especially when combining human review with AI-assisted development.
