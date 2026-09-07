# AI Visibility section

Render AiVisibilitySection inside ReportProvider with AiVisibilityData. It is
composed from the existing NextStepsIntro (Artboard 4), ReportHeading,
HighlightNumber, RankEntities, and QuestionsAsked components.

The opener is a serif main heading. Its three subsections use sans-serif headings
and no individual dividers; one bottom divider closes the main section.

- Company identity comes from shared context.
- Test counts must be nonnegative integers; namedAnswers must not exceed totalAnswers.
- Test status is supplied by the application; the UI does not invent performance thresholds.
- Citation records reference shared entity IDs. Counts must be nonnegative.
- Citation fill uses the sum of supplied citation counts. Questions and answers
  are different units; 25 sample questions can produce 75 answers.
- Missing per-question mentions display as unavailable, not zero.
- Number formatting uses the shared locale.
- The page owns loading and error states; empty datasets have explicit UI states.

Sample data reproduces the supplied example. The two summary metrics show named
and unnamed answers rather than repeating the same unnamed count twice.
Citation domains resolve from shared identities, including the existing Curio domain.

Preview at #/report-sections after Overview, or Reports/Sections/AI Visibility in Storybook.
