db.createCollection( "user",
   {
      validator: { $or:
         [
            { email: { $regex: /@mongodb\.com$/ } },
            { password: { $type: "string" } },
         ]
      }
   }
)

db.createUser(
        {
            user: "usertest",
            pwd: "passtest",
            roles: [
                {
                    role: "readWrite",
                    db: "dashboard"
                }
            ]
        }
)
