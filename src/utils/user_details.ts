export const getUserDetails = async (id: string, token: string) => {
  try {
    const response = await fetch("http://localhost:5000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `query {
              userDetailsById(id: "${id}") {
                id
                userName
                userEmail
                userGender
                userRole
              }
            }`,
      }),
    });

    const result = (await response.json()) as any;
    return result?.data?.userDetailsById || null;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};
