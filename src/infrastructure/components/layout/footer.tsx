import { useQuery } from "@tanstack/react-query";
import { container } from "@/infrastructure/container";

export const Footer = () => {
  const version = import.meta.env.VITE_VERSION;
  const { data: apiVersion } = useQuery(container.version.get());

  return (
    <>
      <div className="text-muted flex w-full items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <p>Client Version: {version}</p>
          <p>API Version: {apiVersion ?? "unknown"}</p>
        </div>
        <p>
          © {new Date().getFullYear()} Itala · Built by{" "}
          <a
            href="https://github.com/hyoaru"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            hyoaru
          </a>
        </p>
      </div>
    </>
  );
};
