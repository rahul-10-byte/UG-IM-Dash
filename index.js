import express from 'express';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import mongoose from 'mongoose';
import * as AdminJSMongoose from '@adminjs/mongoose';
import { Influencer } from './resources/influ_mrkt.model.js';
import { Users } from './resources/users.model.js';
import bcrypt from 'bcrypt';

AdminJS.registerAdapter(AdminJSMongoose)

const app = express();
// Very basic configuration of AdminJS.
const adminJs = new AdminJS({
    resources: [{
        resource: Influencer},
        {
            resource: Users,
            options: {
                properties: {
                   encryptedPassword: {
                       isVisible: false,
                   },
                   password: {
                       type: 'string',
                       isVisible: {
                           // Make password visible in the edit mode.
                           list: false,
                           edit: true,
                           filter: false,
                           show: false,
                       },
                   },
               },
            actions: {
                new: {
                    // Hash the password.
                    before: async (request) => {
                        if (request.payload.password) {
                            request.payload = {
                                ...request.payload,
                                encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                                password: undefined,
                            };
                        }
                        return request;
                    },
                },
                
                }
            }
        },
        
    ], // We don’t have any resources connected yet.
    rootPath: "/admin", // Path to the AdminJS dashboard.
});
// Build and use a router to handle AdminJS routes.
const router = AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
        cookieName: 'adminjs',
        cookiePassword: 'complicatedsecurepassword',
        authenticate: async (email, password) => {
            const user = await Users.findOne({ email });
            if (user) {
                const matched = await bcrypt.compare(password, user.encryptedPassword);
                if (matched) {
                    return user;
                }
            }
            return false;
        },
    },
    null,
    // Add configuration required by the express-session plugin.
    {
        resave: false, 
        saveUninitialized: true,
    }
);
// const router = AdminJSExpress.buildRouter(adminJs);

app.use(adminJs.options.rootPath, router);


// Run the server.
const run = async () => {
    await mongoose.connect('mongodb+srv://kalyankarrahul500:Rahul1609@influ-mrkt.6qatieb.mongodb.net/', {useNewUrlParser: true});
    await app.listen(8080, () => console.log(`App listening on port 8080!🚀`));
};

run();