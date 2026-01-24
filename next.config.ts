import type { NextConfig } from "next";
import { withWorkflow } from "workflow/next";

const config: NextConfig = {};

export default withWorkflow(config);
