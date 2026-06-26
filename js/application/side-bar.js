// side-bar.js

export function refreshEvidenceUi(route) {

    const evidenceTypes =
        getEvidenceTypes(route);

    const showContent =
        document.getElementById(
            'showContent'
        );

    showContent.innerHTML = '';

    evidenceTypes.forEach(type => {

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = type;

        checkbox.addEventListener(
            'change',
            event => {
                if (
                    event.target.value ===
                    'steepness'
                ) {
                    if (
                        event.target.checked
                    ) {
                        renderSteepnessEvidence(
                            map,
                            route
                        );
                    }
                    else {
                        clearSteepnessEvidence();
                    }
                }
            }
        );

        const label = document.createElement('label');
        label.appendChild(checkbox);
        label.append(` ${type}`);
        label.className = 'details-level-1';
        showContent.appendChild(label);
        showContent.appendChild(document.createElement('br'));
    });
}

export function refreshEvidenceMetricsUi(
    route
) {
    const evidenceTypes = getEvidenceTypes(route);
    const evidenceSources = getEvidenceSources(route);
    const evidenceMetricsContent = document.getElementById('evidenceMetricsContent');

    evidenceMetricsContent.innerHTML = '';

    let evidenceHeading = document.createElement('div');
    evidenceHeading.className = 'details-level-1';
    evidenceHeading.textContent = 'Types';
    evidenceMetricsContent.appendChild(evidenceHeading);

    evidenceTypes.forEach(type => {
        const count =
        getEvidenceByType(
            route,
            type
        ).length;

        const div = document.createElement('div');
        div.className = 'details-level-2';
        div.textContent = `${type}: ${count}`;
        evidenceMetricsContent.appendChild(div);
    });

    evidenceHeading = document.createElement('div');
    evidenceHeading.className = 'details-level-1';
    evidenceHeading.textContent = 'Sources';
    evidenceMetricsContent.appendChild(evidenceHeading);

    evidenceSources.forEach(source => {
        const count =
        getEvidenceBySource(
            route,
            source
        ).length;

        const div = document.createElement('div');
        div.className = 'details-level-2';
        div.textContent = `${source}: ${count}`;
        evidenceMetricsContent.appendChild(div);
    });
}

export function refreshAcquisitionRequestsUi(
    route
) {

    const acquisitionRequestsContent =
        document.getElementById(
            'acquisitionRequestsContent'
        );

    acquisitionRequestsContent.innerHTML = '';

    document.getElementById(
        'acquisitionRequestsSummary'
    ).textContent =

        `Acquisition Requests (${
            route.acquisitionRequests.length
        })`;

    const requestCounts = {};

    route.acquisitionRequests.forEach(
        request => {

            requestCounts[
                request.type
            ] =

                (
                    requestCounts[
                        request.type
                    ] ?? 0
                ) + 1;
        }
    );

    Object.keys(
        requestCounts
    )
    .sort()
    .forEach(
        type => {

            const p =
                document.createElement(
                    'p'
                );

            p.className =
                'details-level-1';

            p.textContent =
                `${type}: ${
                    requestCounts[type]
                }`;

            acquisitionRequestsContent
                .appendChild(
                    p
                );
        }
    );
}

