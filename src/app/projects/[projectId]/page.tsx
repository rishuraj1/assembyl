
interface Props {
    params: Promise<{
        projectId: string;
    }>
}

export default async function ProjectPage({ params }: Props) {
    const { projectId } = await params;
    console.log('Project ID:', projectId);
    return (
        <div>
            <h1>Project Page</h1>
            <p>This is the project page for a specific project.</p>
        </div>
    );
}