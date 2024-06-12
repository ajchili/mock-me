import * as pulumi from "@pulumi/pulumi";

import { App } from "./components/App";

const app = new App("mock-me");

export const frontendURL = pulumi.interpolate`http://${app.assetLoadbalancer.loadBalancer.dnsName}?endpoint=http://${app.serverLoadbalancer.loadBalancer.dnsName}`;
