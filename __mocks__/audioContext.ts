/**
 * Web Audio API Mock for testing
 * This mock simulates AudioContext behavior for unit tests
 */

export class MockAudioContext {
  public currentTime: number = 0;
  public state: AudioContextState = 'running';
  public destination: MockAudioDestinationNode;
  private timeIncrement: number = 0;

  constructor() {
    this.destination = new MockAudioDestinationNode(this);
  }

  createOscillator(): MockOscillatorNode {
    return new MockOscillatorNode(this);
  }

  createGain(): MockGainNode {
    return new MockGainNode(this);
  }

  async resume(): Promise<void> {
    this.state = 'running';
  }

  async suspend(): Promise<void> {
    this.state = 'suspended';
  }

  async close(): Promise<void> {
    this.state = 'closed';
  }

  // Test helper to simulate time progression
  advanceTime(seconds: number): void {
    this.currentTime += seconds;
  }
}

export class MockAudioNode {
  protected context: MockAudioContext;
  protected connections: MockAudioNode[] = [];

  constructor(context: MockAudioContext) {
    this.context = context;
  }

  connect(destination: MockAudioNode): MockAudioNode {
    this.connections.push(destination);
    return destination;
  }

  disconnect(): void {
    this.connections = [];
  }
}

export class MockOscillatorNode extends MockAudioNode {
  public frequency: MockAudioParam;
  public type: OscillatorType = 'sine';
  public startTime: number | null = null;
  public stopTime: number | null = null;

  constructor(context: MockAudioContext) {
    super(context);
    this.frequency = new MockAudioParam(440);
  }

  start(when: number = 0): void {
    this.startTime = when;
  }

  stop(when: number = 0): void {
    this.stopTime = when;
  }
}

export class MockGainNode extends MockAudioNode {
  public gain: MockAudioParam;

  constructor(context: MockAudioContext) {
    super(context);
    this.gain = new MockAudioParam(1.0);
  }
}

export class MockAudioDestinationNode extends MockAudioNode {
  constructor(context: MockAudioContext) {
    super(context);
  }
}

export class MockAudioParam {
  private _value: number;

  constructor(defaultValue: number) {
    this._value = defaultValue;
  }

  get value(): number {
    return this._value;
  }

  set value(newValue: number) {
    this._value = newValue;
  }

  setValueAtTime(value: number, startTime: number): MockAudioParam {
    this._value = value;
    return this;
  }

  linearRampToValueAtTime(value: number, endTime: number): MockAudioParam {
    this._value = value;
    return this;
  }

  exponentialRampToValueAtTime(value: number, endTime: number): MockAudioParam {
    this._value = value;
    return this;
  }
}

// Setup global AudioContext mock for Jest
export function setupAudioContextMock(): void {
  // @ts-ignore
  global.AudioContext = MockAudioContext;
  // @ts-ignore
  global.webkitAudioContext = MockAudioContext;
}
