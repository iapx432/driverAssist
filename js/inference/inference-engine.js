export function runInference(
    route
) {

    route.inferenceNodes.forEach(

        node => node.evaluate(
            route
        )
    );
}
