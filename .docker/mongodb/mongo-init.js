db.createUser(
        {
            user: "usertest",
            pwd: "passtest",
            roles: [
                {
                    role: "readWrite",
                    db: "beyondVision"
                }
            ]
        }
)
