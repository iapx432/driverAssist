
// The orchestrator is responsible for coordinating the reasoning process. It takes a question and a workspace, creates a plan, and iteratively satisfies the requirements of the plan by requesting capabilities from the capability provider. Once all requirements are satisfied, it generates an answer based on the final context of the plan.

const plan = await planner.createPlan(question, workspace);

while (!plan.isSatisfied()) {
    const request = plan.nextRequirement();
    const result = await capabilityProvider.get(request);
    plan.satisfy(request, result);
}

const answer = await planner.reason(plan.context());