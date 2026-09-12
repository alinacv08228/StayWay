import ErrorPage from "../../components/ErrorPage";

export default function UnauthorizedPage() {
    return (
        <div className="admin-load-in admin-load-1">
            <ErrorPage
                code="401"
                title="Unauthorized"
                message="You need to log in to access this page."
            />
        </div>
    );
}