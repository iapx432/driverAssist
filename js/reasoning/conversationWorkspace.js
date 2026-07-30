workspace = {

    currentIntent,

    activeSets,

    observations,

    assumptions,

    pendingQuestions,

    selectedEvidence
};

/**
 * Persistent State
 * GPS
 * Route
 * Weather
 * Vehicle
 * User preferences
 * 
 * Conversation State
 * 
 * current question
 * Previous Answers
 * Assumptions
 * Working Sets
 * 
 * Reasoning Context
 * (subset given to LLM from wider Reasoning State)
 *    
 * Current Route:
 *  
 * Whitby -> Lockton
 *
 * Current ETA:
 * 17:35
 *
 * Sunset:
 * 20:52
 *
 * Steep Sections:
 * 5
 *
 * User Preference:
 * Avoid gradients above 12%
 *
 * Question:
 * Would an alternative route still arrive before sunset?
 */