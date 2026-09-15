// src/app/401/page.tsx

import ErrorPage from "../../components/ErrorPage";

export default function UnauthorizedPage() {
    return (
        <ErrorPage
            code="401"
            title="Unauthorized"
            message="You need to log in to access this page."
        />
    );
}