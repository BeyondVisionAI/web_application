db.createUser(
        {
            user: "beyondvision",
            pwd: "thisisaverysecurepassword",
            roles: [
                {
                    role: "readWrite",
                    db: "beyondvision"
                }
            ]
        }
)
