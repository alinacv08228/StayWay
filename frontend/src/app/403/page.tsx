import ErrorPage from "../../components/ErrorPage";

export default function ForbiddenPage() {
    return (
        <ErrorPage
            code="403"
            title="Access denied"
            message="You do not have permission to access this page."
        />
    );
}