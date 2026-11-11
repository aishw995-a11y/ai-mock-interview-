import { UserProfile, InterviewSession, QuestionBankItem, SkillCategoryScore, CodingProblem, NotificationItem } from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr_default',
  name: 'Alex Chen',
  email: 'alex.chen@example.com',
  targetRole: 'Full Stack Developer',
  experienceLevel: 'Entry Level (0-2 yrs)',
  college: 'Stanford University (BS Computer Science)',
  skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'System Design', 'Git', 'Data Structures'],
  preferredCategory: 'Technical',
  careerGoals: 'Secure a high-impact Software Engineer role at a fast-scaling tech enterprise.',
  isAdmin: true,
  avatarUrl: '/src/assets/images/candidate_success_1794384773899.jpg',
};

export const INITIAL_SESSIONS: InterviewSession[] = [
  {
    id: 'int_001',
    title: 'Full Stack React & API Architecture',
    role: 'Full Stack Developer',
    category: 'Technical',
    difficulty: 'Intermediate',
    durationMinutes: 20,
    actualDurationSeconds: 1140,
    questionCount: 3,
    overallScore: 86,
    date: '2026-11-09',
    status: 'Completed',
    questions: [
      {
        id: 'q1',
        question: 'Explain how React concurrency and fiber reconciliation work under the hood when updating large component trees.',
        category: 'Technical',
        difficulty: 'Intermediate',
        idealAnswerKeyPoints: ['Fiber node structure', 'Work loop & scheduling priorities', 'Interruptible rendering', 'Commit vs Render phase'],
        expectedTimeSeconds: 180,
      },
      {
        id: 'q2',
        question: 'How do you design database schema indexing to prevent slow queries on a high-throughput transaction ledger?',
        category: 'Technical',
        difficulty: 'Intermediate',
        idealAnswerKeyPoints: ['B-Tree index structure', 'Composite indexes and column order', 'Partial indexes & index bloat', 'EXPLAIN ANALYZE queries'],
        expectedTimeSeconds: 180,
      },
      {
        id: 'q3',
        question: 'Describe a time when you had to debug an intermittent memory leak or high-latency bottleneck in production.',
        category: 'Behavioral',
        difficulty: 'Intermediate',
        idealAnswerKeyPoints: ['Heap snapshot analysis', 'Event listener or closure cleanup', 'Reproducing under load', 'Continuous telemetry monitoring'],
        expectedTimeSeconds: 150,
      },
    ],
    answers: {
      q1: 'React Fiber breaks the rendering work into incremental units called fibers. Rather than recursively walking the whole vDOM synchronously which could block the main thread, the work loop checks time slices and yields control back to the browser for user interactions.',
      q2: 'For a ledger table, I would examine query patterns. Frequent filters by user_id and created_at require a composite B-Tree index on (user_id, created_at DESC). I also check execution plans with EXPLAIN ANALYZE to ensure index-only scans and avoid table sequential scans.',
      q3: 'In our checkout microservice, we noticed node processes climbing in memory. I took heap snapshots in our staging replica, diffed them, and discovered WebSocket connections that retained dangling event handler closures. Once unsubscribed in the cleanup lifecycle, memory stabilized under 200MB.',
    },
    evaluations: [
      {
        questionId: 'q1',
        question: 'Explain how React concurrency and fiber reconciliation work under the hood when updating large component trees.',
        candidateAnswer: 'React Fiber breaks the rendering work into incremental units called fibers. Rather than recursively walking the whole vDOM synchronously which could block the main thread, the work loop checks time slices and yields control back to the browser for user interactions.',
        overallScore: 88,
        metrics: {
          relevance: 92,
          technicalKnowledge: 90,
          communication: 88,
          clarity: 86,
          confidence: 85,
          problemSolving: 84,
          grammar: 92,
          completeness: 85,
        },
        strengths: [
          'Accurately explained incremental units of work and main-thread yielding.',
          'Highlighted difference between synchronous recursion and fiber scheduling.',
        ],
        weaknesses: [
          'Did not explicitly mention the distinct render/reconciliation phase versus the synchronous commit phase.',
        ],
        missingConcepts: ['Commit phase vs Render phase', 'useTransition or priority lanes (lane model)'],
        suggestedImprovement: 'Mention how priority lanes allow urgent updates (like keystrokes) to interrupt non-urgent transitions.',
        improvedAnswer: 'React Fiber represents the tree as linked list fibers allowing interruptible work. Updates are assigned priority lanes. In the render phase, React computes changes cooperatively; in the commit phase, changes are applied to the real DOM synchronously to avoid visual tearing.',
        followUpQuestion: 'How does React prioritize an urgent text input change over an in-flight background query?',
      },
      {
        questionId: 'q2',
        question: 'How do you design database schema indexing to prevent slow queries on a high-throughput transaction ledger?',
        candidateAnswer: 'For a ledger table, I would examine query patterns. Frequent filters by user_id and created_at require a composite B-Tree index on (user_id, created_at DESC). I also check execution plans with EXPLAIN ANALYZE to ensure index-only scans and avoid table sequential scans.',
        overallScore: 85,
        metrics: {
          relevance: 90,
          technicalKnowledge: 86,
          communication: 86,
          clarity: 84,
          confidence: 82,
          problemSolving: 85,
          grammar: 90,
          completeness: 82,
        },
        strengths: [
          'Directly identified composite index column ordering rule (equality columns first, range next).',
          'Mentioned EXPLAIN ANALYZE for verification.',
        ],
        weaknesses: [
          'Did not address index write overhead on heavy insert-only ledgers or table partitioning.',
        ],
        missingConcepts: ['Partitioning by time interval', 'Write amplification from excessive indexes'],
        suggestedImprovement: 'Touch on database partitioning for append-only log tables to maintain index sizes in RAM.',
        improvedAnswer: 'For a high-volume ledger, I combine composite B-Tree indexes tailored to query predicates with table partitioning by month. I keep write amplification minimal by only indexing columns queried under strict SLAs, and inspect EXPLAIN (BUFFERS, ANALYZE).',
        followUpQuestion: 'What partitioning strategy would you choose if ledger entries span millions of rows per week?',
      },
      {
        questionId: 'q3',
        question: 'Describe a time when you had to debug an intermittent memory leak or high-latency bottleneck in production.',
        candidateAnswer: 'In our checkout microservice, we noticed node processes climbing in memory. I took heap snapshots in our staging replica, diffed them, and discovered WebSocket connections that retained dangling event handler closures. Once unsubscribed in the cleanup lifecycle, memory stabilized under 200MB.',
        overallScore: 85,
        metrics: {
          relevance: 88,
          technicalKnowledge: 86,
          communication: 88,
          clarity: 87,
          confidence: 85,
          problemSolving: 88,
          grammar: 92,
          completeness: 84,
        },
        strengths: [
          'Excellent STAR narrative structure.',
          'Quantified outcome with specific RAM metric (stabilized under 200MB).',
          'Root cause identified accurately (unclosed event handler closures).',
        ],
        weaknesses: [
          'Could mention regression testing or automated leak detection in CI.',
        ],
        missingConcepts: ['Automated load test validation', 'Synthetic monitoring alerts'],
        suggestedImprovement: 'Add a concluding note on how you prevented recurrence via automated lint rules or teardown unit tests.',
        improvedAnswer: 'When production alerts flagged steady RSS memory growth, I replicated the load in staging and collected Chrome DevTools heap snapshots. Diffing allocations pinpointed uncollected socket listeners. We resolved the closure retention and added lifecycle cleanup tests in CI.',
      },
    ],
    summaryFeedback: {
      overallStrengths: [
        'Strong technical vocabulary and understanding of distributed and frontend internals.',
        'Excellent articulation and concise explanations with concrete data points.',
      ],
      priorityImprovements: [
        'Provide more depth on high-scale trade-offs such as partitioning and priority lanes.',
        'Proactively describe verification and testing strategies after solving bugs.',
      ],
      recommendedTopics: ['PostgreSQL Table Partitioning', 'React 19 Concurrency & Actions', 'System Design Caching Strategies'],
      suggestedNextDifficulty: 'Advanced',
    },
  },
  {
    id: 'int_002',
    title: 'Senior Engineering Leadership & Behavioral',
    role: 'Full Stack Developer',
    category: 'Behavioral',
    difficulty: 'Advanced',
    durationMinutes: 15,
    actualDurationSeconds: 880,
    questionCount: 2,
    overallScore: 82,
    date: '2026-11-04',
    status: 'Completed',
    questions: [
      {
        id: 'bq1',
        question: 'Describe how you handle a scenario where product requirements are ambiguous and the deadline is aggressively fixed.',
        category: 'Behavioral',
        difficulty: 'Advanced',
        idealAnswerKeyPoints: ['Iterative scoping', 'Stakeholder alignment', 'MVP definition', 'Risk mitigation'],
      },
      {
        id: 'bq2',
        question: 'Give an example of a technical debt compromise you made. How did you advocate for paying it down later?',
        category: 'Behavioral',
        difficulty: 'Advanced',
        idealAnswerKeyPoints: ['Conscious trade-off documentation', 'Business context justification', 'Quantified debt impact', 'Dedicated refactor sprint'],
      },
    ],
    answers: {
      bq1: 'When deadlines are fixed and scope is ambiguous, I organize a rapid kickoff with the product manager to identify the critical user journey. We freeze a minimal viable slice for the milestone, flag optional features into subsequent sprints, and establish daily async check-ins.',
      bq2: 'During a Black Friday launch, we opted for synchronous inventory checks rather than an async message queue to meet our delivery date. I documented the throughput risk in our ADR. After peak season, I presented latency data showing 300ms overhead, which secured leadership approval for a 2-week queue migration.',
    },
    evaluations: [
      {
        questionId: 'bq1',
        question: 'Describe how you handle a scenario where product requirements are ambiguous and the deadline is aggressively fixed.',
        candidateAnswer: 'When deadlines are fixed and scope is ambiguous, I organize a rapid kickoff with the product manager to identify the critical user journey. We freeze a minimal viable slice for the milestone, flag optional features into subsequent sprints, and establish daily async check-ins.',
        overallScore: 84,
        metrics: {
          relevance: 88,
          technicalKnowledge: 80,
          communication: 88,
          clarity: 86,
          confidence: 84,
          problemSolving: 85,
          grammar: 92,
          completeness: 82,
        },
        strengths: ['Pragmatic approach to scope negotiation.', 'Clear stakeholder collaboration.'],
        weaknesses: ['Could mention how you communicated with the engineering team to prevent burnout.'],
        missingConcepts: ['Engineering capacity protection', 'Post-launch retro alignment'],
        suggestedImprovement: 'Highlight team communication and transparent risk escalation to executives.',
        improvedAnswer: 'I address fixed deadlines and vague scope through rapid prioritization: partnering with PMs to lock the essential 20% of features driving 80% of value, documenting assumptions, and maintaining transparent milestone burndown charts.',
      },
      {
        questionId: 'bq2',
        question: 'Give an example of a technical debt compromise you made. How did you advocate for paying it down later?',
        candidateAnswer: 'During a Black Friday launch, we opted for synchronous inventory checks rather than an async message queue to meet our delivery date. I documented the throughput risk in our ADR. After peak season, I presented latency data showing 300ms overhead, which secured leadership approval for a 2-week queue migration.',
        overallScore: 80,
        metrics: {
          relevance: 85,
          technicalKnowledge: 82,
          communication: 84,
          clarity: 82,
          confidence: 80,
          problemSolving: 82,
          grammar: 90,
          completeness: 80,
        },
        strengths: ['Great usage of Architectural Decision Records (ADRs).', 'Used data to justify refactoring.'],
        weaknesses: ['Could outline how team velocity was tracked before and after the refactor.'],
        missingConcepts: ['Team velocity metrics', 'Error budget allocation'],
        suggestedImprovement: 'State the reliability increase or cost reduction after the debt was resolved.',
        improvedAnswer: 'We chose a synchronous inventory model to launch before Q4 peak, recording the technical debt in an ADR. Post-peak, I leveraged telemetry showing 300ms latency and 99.4% availability to propose an asynchronous queue, increasing throughput 4x and reducing database load.',
      },
    ],
    summaryFeedback: {
      overallStrengths: ['Data-driven decision making', 'Strong leadership communication'],
      priorityImprovements: ['Elaborate on team empathy and engineering well-being during crunches'],
      recommendedTopics: ['Executive Stakeholder Management', 'Architectural Decision Frameworks'],
      suggestedNextDifficulty: 'Advanced',
    },
  },
  {
    id: 'int_003',
    title: 'Data Structures & System Scalability',
    role: 'Software Developer',
    category: 'Data Structures and Algorithms',
    difficulty: 'Intermediate',
    durationMinutes: 20,
    actualDurationSeconds: 1200,
    questionCount: 2,
    overallScore: 79,
    date: '2026-10-28',
    status: 'Completed',
    questions: [
      {
        id: 'dq1',
        question: 'How would you design an LRU (Least Recently Used) Cache with O(1) read and write time complexities?',
        category: 'Data Structures and Algorithms',
        difficulty: 'Intermediate',
        idealAnswerKeyPoints: ['HashMap + Doubly Linked List', 'O(1) lookup in map', 'O(1) deletion and insertion in DLL', 'Eviction policy'],
      },
      {
        id: 'dq2',
        question: 'Compare B-Trees vs LSM Trees (Log-Structured Merge-Trees) in storage engines.',
        category: 'Technical',
        difficulty: 'Advanced',
        idealAnswerKeyPoints: ['Read optimization vs Write optimization', 'In-place updates vs Sequential writes', 'Compaction overhead', 'Use cases (Postgres vs Cassandra/RocksDB)'],
      },
    ],
    answers: {
      dq1: 'An LRU Cache can be implemented using a Hash Map combined with a Doubly Linked List. The hash map stores keys mapped to linked list nodes for O(1) key access, while the doubly linked list maintains usage order. When a key is accessed or updated, it moves to the head. When capacity is exceeded, the tail node is evicted in O(1).',
      dq2: 'B-Trees are optimized for reads with in-place page updates, commonly used in relational databases like PostgreSQL. LSM Trees prioritize write throughput by appending writes to an in-memory memtable and flushing SSTables sequentially to disk, followed by background compaction. Systems like Cassandra and RocksDB rely on LSM trees.',
    },
    evaluations: [
      {
        questionId: 'dq1',
        question: 'How would you design an LRU (Least Recently Used) Cache with O(1) read and write time complexities?',
        candidateAnswer: 'An LRU Cache can be implemented using a Hash Map combined with a Doubly Linked List. The hash map stores keys mapped to linked list nodes for O(1) key access, while the doubly linked list maintains usage order. When a key is accessed or updated, it moves to the head. When capacity is exceeded, the tail node is evicted in O(1).',
        overallScore: 85,
        metrics: {
          relevance: 90,
          technicalKnowledge: 88,
          communication: 86,
          clarity: 88,
          confidence: 84,
          problemSolving: 86,
          grammar: 92,
          completeness: 84,
        },
        strengths: ['Identified exact standard optimal data structure (HashMap + DLL).', 'Clear explanation of eviction mechanism.'],
        weaknesses: ['Could mention thread-safety or concurrent cache eviction strategies (e.g. read-write locks or 2Q).'],
        missingConcepts: ['Thread-safety in multi-threaded runtime', 'Lock striping or Sharded LRU'],
        suggestedImprovement: 'Discuss concurrency challenges like lock contention under high multi-threaded read traffic.',
        improvedAnswer: 'A classic LRU cache pairs a Hash Map with a Doubly Linked List for O(1) lookups and head/tail node manipulations. In production systems, to avoid global mutex contention, we often use lock striping, Segmented LRU, or Clock-Pro algorithms.',
      },
      {
        questionId: 'dq2',
        question: 'Compare B-Trees vs LSM Trees (Log-Structured Merge-Trees) in storage engines.',
        candidateAnswer: 'B-Trees are optimized for reads with in-place page updates, commonly used in relational databases like PostgreSQL. LSM Trees prioritize write throughput by appending writes to an in-memory memtable and flushing SSTables sequentially to disk, followed by background compaction. Systems like Cassandra and RocksDB rely on LSM trees.',
        overallScore: 73,
        metrics: {
          relevance: 82,
          technicalKnowledge: 75,
          communication: 78,
          clarity: 76,
          confidence: 74,
          problemSolving: 72,
          grammar: 88,
          completeness: 70,
        },
        strengths: ['Accurately distinguished read-heavy vs write-heavy architectural goals.'],
        weaknesses: ['Did not mention Bloom filters used in LSM trees to reduce read amplification.'],
        missingConcepts: ['Bloom filters for SSTable checks', 'Write amplification vs Read amplification'],
        suggestedImprovement: 'Elaborate on how LSM trees mitigate read latency through Bloom filters and leveled compaction.',
        improvedAnswer: 'B-Trees minimize read amplification via shallow tree heights and in-place updates, paying a random I/O penalty on writes. LSM Trees convert random writes into sequential writes via Memtables and SSTables, utilizing Bloom filters and Leveled Compaction to prevent severe read degradation.',
      },
    ],
    summaryFeedback: {
      overallStrengths: ['Accurate core CS algorithmic knowledge'],
      priorityImprovements: ['Deepen knowledge of storage engine trade-offs like amplification and concurrency'],
      recommendedTopics: ['LSM Compaction Strategies', 'Concurrent Data Structures'],
      suggestedNextDifficulty: 'Intermediate',
    },
  },
];

export const INITIAL_SKILLS: SkillCategoryScore[] = [
  {
    name: 'Technical Depth',
    category: 'Engineering',
    currentScore: 84,
    previousScore: 78,
    improvementPercentage: 7.7,
    recommendedPractice: 'Study distributed caching patterns and database indexing.',
    learningSuggestions: ['Review PostgreSQL EXPLAIN query plans', 'Explore React 19 Concurrent rendering', 'Examine thread safety in shared memory'],
  },
  {
    name: 'Communication & Structure',
    category: 'Soft Skills',
    currentScore: 87,
    previousScore: 82,
    improvementPercentage: 6.1,
    recommendedPractice: 'Refine STAR method storytelling with concise metrics.',
    learningSuggestions: ['Practice 90-second executive summaries', 'Frame technical trade-offs with business ROI', 'Clarify constraints before answering'],
  },
  {
    name: 'Problem-Solving & Algorithms',
    category: 'Computer Science',
    currentScore: 80,
    previousScore: 75,
    improvementPercentage: 6.6,
    recommendedPractice: 'Focus on time/space complexity trade-offs and edge cases.',
    learningSuggestions: ['Implement custom LRU & LFU caches', 'Study graph traversal (Dijkstra, Topological sort)', 'Analyze amortized complexity'],
  },
  {
    name: 'Behavioral & Leadership',
    category: 'Leadership',
    currentScore: 85,
    previousScore: 80,
    improvementPercentage: 6.2,
    recommendedPractice: 'Formulate anecdotes around conflict resolution and mentorship.',
    learningSuggestions: ['Document 5 major project conflict stories', 'Practice articulating decisions with imperfect data', 'Lead post-mortem presentations'],
  },
  {
    name: 'System Design & Architecture',
    category: 'Engineering',
    currentScore: 81,
    previousScore: 74,
    improvementPercentage: 9.5,
    recommendedPractice: 'Practice back-of-the-envelope calculations and fault tolerance.',
    learningSuggestions: ['Design URL shortener with rate limiting', 'Explore event-driven architectures with Kafka', 'Study database replication & consensus'],
  },
  {
    name: 'Clarity & Delivery',
    category: 'Soft Skills',
    currentScore: 88,
    previousScore: 85,
    improvementPercentage: 3.5,
    recommendedPractice: 'Maintain steady pacing and eliminate filler phrases.',
    learningSuggestions: ['Record mock answers and listen for vocal filler words', 'Use pauses intentionally instead of "um" or "like"', 'Summarize final takeaway'],
  },
];

export const INITIAL_QUESTION_BANK: QuestionBankItem[] = [
  {
    id: 'qb_01',
    question: 'How do you prevent SQL Injection and Cross-Site Scripting (XSS) in modern full-stack web applications?',
    category: 'Technical',
    role: 'Software Developer',
    difficulty: 'Intermediate',
    sampleAnswer: 'SQL injection is mitigated by parameterized queries and prepared statements via ORMs rather than string concatenation. XSS is prevented by context-aware HTML escaping, avoiding innerHTML/dangerouslySetInnerHTML, enforcing strict Content Security Policy (CSP) headers, and using HttpOnly cookies for session tokens.',
    tags: ['Security', 'Backend', 'Web'],
  },
  {
    id: 'qb_02',
    question: 'Tell me about a time you missed a project deadline or made a critical mistake in code. What did you do?',
    category: 'Behavioral',
    role: 'Software Developer',
    difficulty: 'Intermediate',
    sampleAnswer: 'During a release cycle, an unindexed query brought database CPU to 95%. I immediately acknowledged the issue in our incident channel, rolled back the release, and added the composite index. I authored a blameless post-mortem and introduced an automated CI check that flags unindexed foreign keys.',
    tags: ['Accountability', 'STAR', 'Incident Response'],
  },
  {
    id: 'qb_03',
    question: 'What is the Event Loop in Node.js, and how does the libuv thread pool interact with microtasks and macrotasks?',
    category: 'Technical',
    role: 'Full Stack Developer',
    difficulty: 'Advanced',
    sampleAnswer: 'The event loop runs on a single thread orchestrating phases: timers, pending callbacks, idle/prepare, poll, check (setImmediate), and close callbacks. Microtasks (process.nextTick and Promise callbacks) execute immediately after each operation before advancing phases. Libuv handles asynchronous I/O and CPU-bound operations in a thread pool.',
    tags: ['Node.js', 'Async', 'JavaScript'],
  },
  {
    id: 'qb_04',
    question: 'How do you resolve a situation where a stakeholder demands a major feature change two days before product launch?',
    category: 'Management',
    role: 'Engineering Lead',
    difficulty: 'Advanced',
    sampleAnswer: 'I evaluate the business urgency calmly. I map out the risk of introducing untested regressions against the feature value, present the PM with a transparent trade-off (e.g. ship core on time, follow up with feature in a minor point release 48 hours later behind a feature flag), and keep documentation transparent.',
    tags: ['Stakeholder Management', 'Scoping', 'Leadership'],
  },
  {
    id: 'qb_05',
    question: 'Explain the CAP Theorem and how PACELC extends it for distributed storage systems.',
    category: 'Technical',
    role: 'Backend Developer',
    difficulty: 'Advanced',
    sampleAnswer: 'The CAP theorem states a distributed system can only provide two of Consistency, Availability, and Partition Tolerance. PACELC extends this: in case of Partition (P), choose Availability (A) or Consistency (C); Else (E), choose Latency (L) or Consistency (C). For example, DynamoDB favors Availability and low Latency, while Spanner prioritizes strict Consistency.',
    tags: ['System Design', 'Distributed Systems'],
  },
  {
    id: 'qb_06',
    question: 'Why do you want to join our organization, and what makes you unique compared to other candidates?',
    category: 'HR',
    role: 'General',
    difficulty: 'Beginner',
    sampleAnswer: 'I admire the company focus on developer-first reliability and scale. What makes me stand out is my hybrid strength in full-stack engineering paired with disciplined product intuition. I do not just write code to pass tests; I ensure it drives measurable customer outcomes and stays maintainable.',
    tags: ['HR', 'Culture', 'Motivation'],
  },
];

export const CODING_PROBLEMS: CodingProblem[] = [
  {
    id: 'cp_01',
    title: 'Two Sum with Indices',
    difficulty: 'Easy',
    category: 'Arrays & Hash Tables',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. Return the answer in any order.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (map.count(complement)) {
                return {map[complement], i};
            }
            map[nums[i]] = i;
        }
        return {};
    }
};`,
    },
    testCases: [
      {
        input: [[2, 7, 11, 15], 9],
        expected: [0, 1],
        displayInput: 'nums = [2,7,11,15], target = 9',
        displayExpected: '[0, 1]',
      },
      {
        input: [[3, 2, 4], 6],
        expected: [1, 2],
        displayInput: 'nums = [3,2,4], target = 6',
        displayExpected: '[1, 2]',
      },
      {
        input: [[3, 3], 6],
        expected: [0, 1],
        displayInput: 'nums = [3,3], target = 6',
        displayExpected: '[0, 1]',
      },
    ],
  },
  {
    id: 'cp_02',
    title: 'Valid Parentheses Matching',
    difficulty: 'Easy',
    category: 'Stack',
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid. Open brackets must be closed by the same type of brackets, and in the correct order. Every close bracket has a corresponding open bracket.',
    examples: [
      {
        input: 's = "()[]{}"',
        output: 'true',
      },
      {
        input: 's = "(]"',
        output: 'false',
      },
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only "()[]{}"'],
    starterCode: {
      javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char in map) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
      typescript: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char in map) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
      python: `def isValid(s: str) -> bool:
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return not stack`,
      java: `class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`,
      cpp: `class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c == '(' || c == '{' || c == '[') st.push(c);
            else {
                if (st.empty()) return false;
                char top = st.top();
                if ((c == ')' && top != '(') || (c == '}' && top != '{') || (c == ']' && top != '[')) return false;
                st.pop();
            }
        }
        return st.empty();
    }
};`,
    },
    testCases: [
      {
        input: ['()[]{}'],
        expected: true,
        displayInput: 's = "()[]{}"',
        displayExpected: 'true',
      },
      {
        input: ['(]'],
        expected: false,
        displayInput: 's = "(]"',
        displayExpected: 'false',
      },
      {
        input: ['([{}])'],
        expected: true,
        displayInput: 's = "([{}])"',
        displayExpected: 'true',
      },
    ],
  },
  {
    id: 'cp_03',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Sliding Window',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: '1',
      },
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {
  let maxLength = 0;
  let start = 0;
  const map = new Map();
  for (let end = 0; end < s.length; end++) {
    const char = s[end];
    if (map.has(char) && map.get(char) >= start) {
      start = map.get(char) + 1;
    }
    map.set(char, end);
    maxLength = Math.max(maxLength, end - start + 1);
  }
  return maxLength;
}`,
      typescript: `function lengthOfLongestSubstring(s: string): number {
  let maxLength = 0;
  let start = 0;
  const map = new Map<string, number>();
  for (let end = 0; end < s.length; end++) {
    const char = s[end];
    if (map.has(char) && map.get(char)! >= start) {
      start = map.get(char)! + 1;
    }
    map.set(char, end);
    maxLength = Math.max(maxLength, end - start + 1);
  }
  return maxLength;
}`,
      python: `def lengthOfLongestSubstring(s: str) -> int:
    char_map = {}
    max_len = 0
    start = 0
    for end, char in enumerate(s):
        if char in char_map and char_map[char] >= start:
            start = char_map[char] + 1
        char_map[char] = end
        max_len = max(max_len, end - start + 1)
    return max_len`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        int maxLength = 0, start = 0;
        Map<Character, Integer> map = new HashMap<>();
        for (int end = 0; end < s.length(); end++) {
            char c = s.charAt(end);
            if (map.containsKey(c) && map.get(c) >= start) {
                start = map.get(c) + 1;
            }
            map.put(c, end);
            maxLength = Math.max(maxLength, end - start + 1);
        }
        return maxLength;
    }
}`,
      cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> map;
        int maxLen = 0, start = 0;
        for (int end = 0; end < s.length(); end++) {
            char c = s[end];
            if (map.count(c) && map[c] >= start) {
                start = map[c] + 1;
            }
            map[c] = end;
            maxLen = max(maxLen, end - start + 1);
        }
        return maxLen;
    }
};`,
    },
    testCases: [
      {
        input: ['abcabcbb'],
        expected: 3,
        displayInput: 's = "abcabcbb"',
        displayExpected: '3',
      },
      {
        input: ['bbbbb'],
        expected: 1,
        displayInput: 's = "bbbbb"',
        displayExpected: '1',
      },
      {
        input: ['pwwkew'],
        expected: 3,
        displayInput: 's = "pwwkew"',
        displayExpected: '3',
      },
    ],
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Evaluation Report Ready',
    message: 'Your report for "Full Stack React & API Architecture" is ready with score 86/100.',
    time: '2 hours ago',
    read: false,
    type: 'report',
  },
  {
    id: 'notif_2',
    title: 'New Skill Milestone',
    message: 'Technical Depth improved by +7.7% over the last 3 mock sessions.',
    time: '1 day ago',
    read: true,
    type: 'milestone',
  },
  {
    id: 'notif_3',
    title: 'Weekly Interview Goal',
    message: 'You have completed 3 of your 4 target mock sessions for this week. Keep the momentum going!',
    time: '2 days ago',
    read: true,
    type: 'reminder',
  },
];
