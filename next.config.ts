import type { NextConfig } from "next";
import { withWorkflow } from "workflow/next";

const config: NextConfig = {
	outputFileTracingIncludes: {
		"/api/webhook": ["./workflows/**", "./lib/**"],
	},
};

export default withWorkflow(config);
