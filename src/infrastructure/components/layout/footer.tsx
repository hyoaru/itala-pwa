import { useQuery } from "@tanstack/react-query";
import { container } from "@/infrastructure/container";

export const Footer = () => {
  const version = import.meta.env.VITE_VERSION;
  const { data: apiVersion } = useQuery(container.version.get());

  return (
    <>
      <div className="text-muted/40 mt-2 flex w-full items-center justify-between gap-4 text-[0.65rem] sm:text-xs">
        <div className="flex items-center gap-4">
          <p>Client: {version}</p>
          <p>API: {apiVersion ?? "unknown"}</p>
        </div>
        <p>
          © {new Date().getFullYear()} Itala · Built by{" "}
          <a
            href="https://github.com/hyoaru"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {"hyoaru"}
          </a>
        </p>
      </div>
    </>
  );
};
