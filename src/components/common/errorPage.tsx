import { Component, type ErrorInfo, type ReactNode } from "react";
import { withTranslation, type WithTranslation } from "react-i18next";
import { Link } from "react-router";

interface ErrorBoundaryProps extends WithTranslation {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Update state to indicate an error occurred
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error information if needed
    console.error("Error:", error);
    console.error("Error Info:", errorInfo);
  }

  render(): ReactNode {
    const { t } = this.props;

    if (this.state.hasError) {
      // Render a custom error component or redirect to an error page
      return (
        <div className="flex flex-col items-center  h-full w-full flex-center">
          <div className="flex flex-col gap-3 items-center">
            <h1>{t("error:sessionExpired.title")}</h1>
            <p>{t("error:sessionExpired.message")}</p>
            <Link to="/">{t("error:sessionExpired.goToHome")}</Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export default withTranslation("error")(ErrorBoundary);
