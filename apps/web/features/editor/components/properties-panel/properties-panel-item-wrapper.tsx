type PropertiesPanelItemWrapperProps = {
  title: string;
  children: React.ReactNode;
};

export const PropertiesPanelItemWrapper = ({
  title,
  children,
}: PropertiesPanelItemWrapperProps) => {
  return (
    <div>
      <p className="text-xs text-neutral-600">{title}</p>
      {children}
    </div>
  );
};
