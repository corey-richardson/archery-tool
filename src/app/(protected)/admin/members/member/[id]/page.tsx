const MemberProfile = async ({ params }: { params: { id: string } }) => {
    const p = await params;
    const userId = p.id;

    return (
        <>
            <h1>GOOD MORNINGGGGG VIETNAM</h1>
            <p>{ userId }</p>
        </>
    );
}

export default MemberProfile;
