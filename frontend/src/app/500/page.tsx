import ErrorPage from "../../components/ErrorPage";

export default function ServerErrorPage() {
    return (
        <ErrorPage
            code="500"
            title="Something went wrong"
            message="An unexpected error occurred. Please try again later."
        />
    );
}