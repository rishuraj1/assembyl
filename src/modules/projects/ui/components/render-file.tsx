const RenderFile = ({ fileUrl, fileType }: { fileUrl: string, fileType: string }) => {
    if (fileType.startsWith("image/")) {
        return (
            <span>Image ${fileUrl}</span>
        )
    }
}