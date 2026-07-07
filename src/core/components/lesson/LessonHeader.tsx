interface LessonHeaderProps {
  progressPercentage: number;
}

export const LessonHeader = ({ progressPercentage }: LessonHeaderProps) => {
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(progressPercentage)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-0 left-0 right-0 h-1.5 z-50 bg-slate-200"
    >
      <div
        className="h-full character-accent transition-all duration-500"
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  );
};
