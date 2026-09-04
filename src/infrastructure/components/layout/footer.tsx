export const Footer = () => {
  const version = import.meta.env.VITE_VERSION;
  return (
    <>
      <div className="text-muted flex w-full items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <p>Client Version: {version}</p>
          <p>API Version: {version}</p>
        </div>
        <p>© 2026 Itala · Built by Jj Cabrera</p>
      </div>
    </>
  );
};
