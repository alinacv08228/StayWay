import ErrorPage from "../../components/ErrorPage";

export default function ServerErrorPage() {
    return (
        <div className="admin-load-in admin-load-1">
            <ErrorPage
                code="500"
                title="Something went wrong"
                message="An unexpected error occurred. Please try again later."
            />
        </div>
    );
}