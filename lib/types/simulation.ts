export type SimulationMode = 'basic' | 'advanced';

export type SimulationState = {
    balance: number;
    virtualPnL: number;
    riskScore: number;
};

export type Trade = {
    asset: string;
    quantity: number;
    price: number;
    timestamp: string;
};