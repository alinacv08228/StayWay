import ErrorPage from "../../components/ErrorPage";

export default function ForbiddenPage() {
    return (
        <div className="admin-load-in admin-load-1">
            <ErrorPage
                code="403"
                title="Access denied"
                message="You do not have permission to access this page."
            />
        </div>
    );
}