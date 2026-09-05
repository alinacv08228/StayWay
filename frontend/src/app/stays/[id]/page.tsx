import StayPageClient from "./StayPageClient";

type StayPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function StayPage({
                                           params,
                                       }: StayPageProps) {
    const { id } = await params;

    return (
        <StayPageClient id={id} />
    );
}