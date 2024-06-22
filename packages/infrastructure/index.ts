import * as pulumi from "@pulumi/pulumi";

import { App } from "./components/App";

const app = new App("mock-me");

export const url = pulumi.interpolate`http://${app.loadbalancer.dnsName}`;
