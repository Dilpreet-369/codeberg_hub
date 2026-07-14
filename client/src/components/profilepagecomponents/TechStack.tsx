interface TechStackProps {
  skills: string[];
}

export const TechStack = ({ skills }: TechStackProps) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border-y sm:border border-zinc-200 dark:border-zinc-800/80 p-4">
      <h3 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2.5">
        Core Technical Stack
      </h3>
      {skills && skills.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill, index) => (
            <span key={index} className="text-xs px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/40 dark:border-zinc-700/40 font-medium font-mono">
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-zinc-400 dark:text-slate-500 italic">No tech interests selected.</p>
      )}
    </div>
  );
};