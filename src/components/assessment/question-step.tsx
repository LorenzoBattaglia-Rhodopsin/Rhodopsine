import { LikertScale } from "@/components/assessment/likert-scale";
import { domainLabels } from "@/data/questions";
import type { AssessmentQuestion, LikertValue } from "@/types/assessment";

/**
 * Singola schermata di domanda del wizard.
 * Usa <fieldset>/<legend> per una semantica corretta del gruppo di risposte.
 */
interface QuestionStepProps {
  question: AssessmentQuestion;
  value?: LikertValue;
  onChange: (value: LikertValue) => void;
}

export function QuestionStep({ question, value, onChange }: QuestionStepProps) {
  const labelId = `q-${question.id}-label`;
  const helperId = question.helper ? `q-${question.id}-helper` : undefined;

  return (
    <div className="border-0 p-0">
      <p className="text-eyebrow font-medium uppercase text-primary">
        {domainLabels[question.domain]}
      </p>

      <div id={labelId} className="mt-3 text-title font-semibold text-balance text-foreground">
        {question.text}
      </div>

      {question.helper && (
        <p id={helperId} className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {question.helper}
        </p>
      )}

      <LikertScale
        questionId={question.id}
        value={value}
        onChange={onChange}
        ariaLabelledBy={labelId}
        ariaDescribedBy={helperId}
      />
    </div>
  );
}
