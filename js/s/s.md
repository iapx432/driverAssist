::: mermaid
flowchart LR

    classDef node fill:#fc6
    classDef expression fill:#dd7
    classDef term fill:#ce8
    classDef op fill:#cf8

    subgraph "s-node"
        subgraph "s-expression"
            subgraph "s-term*"
                subgraph "set"
                    A[A.transform]
                end
                A --> U
                subgraph "op"
                    U[operation.basis]
                end
            end
        end
    end

:::
