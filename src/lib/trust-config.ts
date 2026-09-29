import * as yaml from "js-yaml";
import { ZodError, z } from "zod";

const metricSchema = z.object({
  label: z.string(),
  value: z.string(),
  caption: z.string().optional(),
});

const complianceSchema = z.object({
  name: z.string(),
  status: z.string(),
  year: z.union([z.string(), z.number()]).optional(),
  scope: z.string().optional(),
  badge: z.string().optional(),
});

const documentSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.string(),
  access: z.enum(["public", "request"]).default("request"),
  tags: z.array(z.string()).default([]),
  url: z.string().optional(),
  updatedAt: z.string().optional(),
});

const policySchema = z.object({
  name: z.string(),
  owner: z.string().optional(),
  coverage: z.string().optional(),
  cadence: z.string().optional(),
});

const updateSchema = z.object({
  date: z.string(),
  title: z.string(),
  summary: z.string(),
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const layoutSchema = z
  .object({
    compliance: z.enum(["full", "half"]).optional(),
    policies: z.enum(["full", "half"]).optional(),
    documents: z.enum(["full", "half"]).optional(),
    infrastructure: z.enum(["full", "half"]).optional(),
    monitoring: z.enum(["full", "half"]).optional(),
    updates: z.enum(["full", "half"]).optional(),
    faqs: z.enum(["full", "half"]).optional(),
    subprocessors: z.enum(["full", "half"]).optional(),
    contacts: z.enum(["full", "half"]).optional(),
  })
  .optional();

const sectionKeyEnum = z.enum([
  "documents",
  "compliance",
  "policies",
  "infrastructure",
  "monitoring",
  "updates",
  "faqs",
  "subprocessors",
  "contacts",
]);

export const trustCenterSchema = z.object({
  theme: z.enum(["light", "dark"]).default("light"),
  subprocessorsLink: z.string().url().optional(),
  layout: layoutSchema,
  sections: z.array(sectionKeyEnum).optional(),
  company: z.object({
    name: z.string(),
    tagline: z.string(),
    description: z.string(),
    website: z.string().optional(),
    logo: z.string().optional(),
    headquarters: z.string().optional(),
    trustLead: z.string().optional(),
  }),
  hero: z
    .object({
      statusMessage: z.string().optional(),
      lastUpdate: z.string().optional(),
      commitments: z.array(z.string()).default([]),
    })
    .optional()
    .default({
      commitments: [],
    }),
  metrics: z.array(metricSchema).optional(),
  compliance: z.array(complianceSchema).optional(),
  documents: z.array(documentSchema).optional(),
  policies: z.array(policySchema).optional(),
  infrastructure: z
    .object({
      hosting: z.string().optional(),
      dataResidency: z.array(z.string()).default([]),
      dataCenters: z.array(z.string()).default([]),
      encryption: z.string().optional(),
      retention: z.string().optional(),
      backups: z.string().optional(),
    })
    .optional(),
  monitoring: z
    .object({
      statusPage: z.string().optional(),
      incidentHistory: z
        .array(
          z.object({
            date: z.string(),
            summary: z.string(),
            impact: z.string(),
          })
        )
        .default([]),
    })
    .optional(),
  contacts: z
    .object({
      email: z.string().email(),
      sla: z.string(),
      phone: z.string().optional(),
      officeHours: z.string().optional(),
    })
    .optional(),
  faqs: z.array(faqSchema).optional(),
  subprocessors: z
    .array(
      z.object({
        name: z.string(),
        category: z.string(),
        location: z.string(),
        logo: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .optional(),
  updates: z.array(updateSchema).optional(),
});

export type TrustCenterConfig = z.infer<typeof trustCenterSchema>;

export const DEFAULT_TRUST_YAML = `theme: light
company:
  name: "&Element"
  tagline: Interactive digital experiences for retail and brand environments
  description: Element Softworks Ltd (trading as &Element) designs, builds and hosts interactive in-store and brand experiences. Our trust program covers UK GDPR, Cyber Essentials and IASME Cyber Assurance across our people, devices and cloud platforms.
  website: https://and-element.com
  logo: https://and-element.com/assets/icon-192.png
  headquarters: Colchester, Essex, United Kingdom
  trustLead: Jack Kent, Lead Engineer (day-to-day); Luke Brown, CEO (accountable)
hero:
  statusMessage: IASME Cyber Assurance certified (September 2026). Cyber Essentials prerequisite held.
  lastUpdate: 2026-09-24
  commitments:
    - Least-privilege access via SSO and Zero Trust controls
    - Encryption in transit (TLS 1.2+) and at rest across cloud services
    - Annual security awareness training for all staff
    - Daily/weekly/monthly backups with restore verification
metrics:
  - label: Policy set
    value: 30+
    caption: Information security and data protection policies
  - label: Open risks tracked
    value: "20"
    caption: Live information-security risk register
compliance:
  - name: IASME Cyber Assurance
    status: Certified
    year: 2026
    scope: Element Softworks Ltd — whole organisation
  - name: Cyber Essentials
    status: Certified
    year: 2026
    scope: Prerequisite technical baseline for IASME Cyber Assurance
  - name: UK GDPR / DPA 2018
    status: Aligned
    scope: Controller for Element business data; processor for client-hosted applications
  - name: ISO 27001
    status: Aligned
    scope: ISMS and control framework mapped to ISO 27001:2022 (not certified)
infrastructure:
  hosting: Google Cloud Platform, AWS and Railway for application hosting; Cloudflare for DNS, CDN and Zero Trust access; Google Workspace for identity and collaboration
  dataResidency:
    - United Kingdom
    - European Economic Area
    - United States (adequacy / IDTA / UK Addendum where required)
  dataCenters:
    - Google Cloud / Google Workspace regions
    - AWS regions
    - Railway cloud regions
    - Cloudflare edge network
  encryption: TLS 1.2+ in transit; provider AES-256 encryption at rest for confidential and personal data; full-disk encryption on managed endpoints
  retention: Retention periods defined in the Data Retention Policy and privacy notice; asset registers and processing records reviewed at least annually
  backups: Daily (7-day), weekly (28-day) and monthly (12-month) backups in ISO 27001 / SOC 2 cloud environments; restore verified periodically
documents:
  - name: Privacy notice
    description: Public notice covering purposes, lawful bases, retention, recipients, international transfers and individual rights.
    category: Privacy
    access: public
    url: https://and-element.com/privacy-policy
    tags:
      - Public
    updatedAt: 2026-08-20
  - name: IASME Cyber Assurance certificate
    description: Certificate 6d21efe2-2f1e-4ea2-9e68-6f9333287a6a confirming IASME Cyber Assurance assessment success.
    category: Certifications
    access: public
    url: https://registry.blockmarktech.com/certificates/6d21efe2-2f1e-4ea2-9e68-6f9333287a6a/
    tags:
      - Public
    updatedAt: 2026-09-02
  - name: Cyber Essentials certificate
    description: Cyber Essentials / IASME Cyber Baseline certificate (569a5277-478b-4ae4-b972-6fcb674d19cd) covering Element Softworks Ltd.
    category: Certifications
    access: public
    url: https://registry.blockmarktech.com/certificates/569a5277-478b-4ae4-b972-6fcb674d19cd/
    tags:
      - Public
    updatedAt: 2026-09-02
  - name: Information security overview
    description: Summary of technical and organisational measures for prospects and security questionnaires.
    category: Overview
    access: request
    tags:
      - Confidential
    updatedAt: 2026-08-24
  - name: Business Continuity Plan
    description: BCP covering identity, edge access, client hosting, source control, finance, collaboration and endpoints with RTO/RPO and recovery playbooks.
    category: Continuity
    access: request
    tags:
      - Confidential
      - NDA
    updatedAt: 2026-08-24
  - name: Information Security Risk Assessment
    description: Current information-security risk register with scored risks and residual-risk approval by the CEO.
    category: Risk
    access: request
    tags:
      - Confidential
      - NDA
    updatedAt: 2026-08-24
  - name: Data Processing Agreement
    description: Processor terms for client application hosting where Element Softworks acts as processor under the client's documented instructions.
    category: Privacy
    access: request
    tags:
      - Contract
    updatedAt: 2026-08-01
  - name: Employers’ Liability certificate
    description: Certificate of Employers’ Liability Insurance (policy RSAP0546202300). Cover from 4 June 2026 to 3 June 2027; minimum £5m as required by UK law (policy limit £10m any one event).
    category: Insurance
    access: public
    url: /documents/employers-liability-certificate-2026.pdf
    tags:
      - Public
    updatedAt: 2026-06-04
  - name: Professional Indemnity schedule
    description: Technology professional indemnity portfolio (P-POR-FL-0021826). £1,000,000 any one claim including defence costs; retroactive date 3 June 2020; period 4 June 2026 – 3 June 2027. Includes cyber and data protection law endorsement for IT trades.
    category: Insurance
    access: public
    url: /documents/professional-indemnity-schedule-2026.pdf
    tags:
      - Public
    updatedAt: 2026-06-04
  - name: Public & Products Liability confirmation
    description: Public and products liability — £2,000,000 any one event / period for products. Period 4 June 2026 – 3 June 2027.
    category: Insurance
    access: request
    tags:
      - Confidential
    updatedAt: 2026-06-04
  - name: Directors & Officers Liability confirmation
    description: Directors & Officers and Corporate Liability £1,000,000 any one claim. Period through March 2027.
    category: Insurance
    access: request
    tags:
      - Confidential
    updatedAt: 2026-06-08
policies:
  - name: Information Security Policy (IS-01)
    owner: Luke Brown, CEO
    coverage: Organisation-wide ISMS commitment, objectives and policy framework for staff, contractors and suppliers
    cadence: Reviewed annually
  - name: Access Control Policy (IS-02)
    owner: Jack Kent, Lead Engineer
    coverage: Least privilege, role-based access, SSO, MFA, Zero Trust remote access, joiner/mover/leaver
    cadence: Access reviewed every 90 days; policy annually
  - name: Asset Management Policy (IS-03)
    owner: Jack Kent, Lead Engineer
    coverage: Physical and information asset registers with named owners; MDM for company devices
    cadence: Reviewed annually and on asset change
  - name: Risk Management Policy (IS-04)
    owner: Luke Brown, CEO
    coverage: Impact × Likelihood scoring, risk appetite and residual-risk approval
    cadence: Reviewed annually or after significant change
  - name: Information Classification and Handling (IS-05)
    owner: Jack Kent, Lead Engineer
    coverage: Public / Internal / Client-Partner / Confidential classification scheme
    cadence: Reviewed annually
  - name: Awareness and Training Policy (IS-06)
    owner: Jack Kent, Lead Engineer
    coverage: Security awareness training with assessed completion for all staff
    cadence: Induction plus annual refresh
  - name: Acceptable Use Policy (IS-07)
    owner: Joe Methven, COO
    coverage: Acceptable use of company systems, data and devices
    cadence: Reviewed annually
  - name: Mobile and Teleworking Policy (IS-09)
    owner: Jack Kent, Lead Engineer
    coverage: Remote working, travel, device control and remote wipe capability
    cadence: Reviewed annually
  - name: Business Continuity Policy (IS-10)
    owner: Jack Kent, Lead Engineer
    coverage: BIA, BCP/DR for critical assets; tabletop exercise programme
    cadence: Reviewed annually; exercise at least annually
  - name: Backup Policy (IS-11)
    owner: Jack Kent, Lead Engineer
    coverage: Segregated cloud backups, encryption, restore testing
    cadence: Restore checks monthly
  - name: Change Management Policy (IS-13)
    owner: Joe Methven, COO / Jack Kent, Lead Engineer
    coverage: Review, approval and rollback for system and network changes
    cadence: Reviewed annually
  - name: Third Party Supplier Security Policy (IS-14)
    owner: Joe Methven, COO
    coverage: Supplier due diligence, DPAs and processor terms review
    cadence: Supplier register reviewed annually
  - name: Logging and Monitoring Policy (IS-16)
    owner: Jack Kent, Lead Engineer
    coverage: Regular review of cloud, edge, endpoint and device-management security alerts
    cadence: Continuous monitoring; policy annually
  - name: Secure Development Policy (IS-19)
    owner: Jack Kent, Lead Engineer
    coverage: Secure SDLC, change control and vulnerability-oriented scanning
    cadence: Reviewed annually
  - name: Incident and Evidence Policy (IS-24)
    owner: Luke Brown, CEO
    coverage: Incident roles, evidence preservation, external notification to ICO and law enforcement where required
    cadence: Reviewed annually
  - name: Cloud Security Policy (IS-26)
    owner: Jack Kent, Lead Engineer
    coverage: Hardening and controls for approved cloud platforms and identity providers
    cadence: Reviewed annually
  - name: Data Protection Policy (DP-01)
    owner: Jack Kent, Lead Engineer
    coverage: UK GDPR roles, lawful bases, DSAR handling, DPIA screening
    cadence: Reviewed annually
  - name: Data Retention Policy (DP-02)
    owner: Jack Kent, Lead Engineer
    coverage: Retention schedules aligned to the privacy notice and processing records
    cadence: Reviewed annually
  - name: DPIA Procedure (DP-03)
    owner: Jack Kent, Lead Engineer
    coverage: Article 35 screening and ICO prior consultation under Article 36
    cadence: Reviewed annually or on material processing change
monitoring:
  incidentHistory: []
updates:
  - date: 2026-09-02
    title: IASME Cyber Assurance certified
    summary: Element Softworks Ltd passed IASME Cyber Assurance assessment (certificate 6d21efe2-2f1e-4ea2-9e68-6f9333287a6a).
  - date: 2026-08-24
    title: Risk assessment and BCP refreshed
    summary: Information-security risk assessment and Business Continuity Plan reviewed; DPIA screening completed for current processing.
  - date: 2026-08-20
    title: Privacy notice updated
    summary: Privacy notice republished at and-element.com/privacy-policy; next scheduled review 20 August 2027.
  - date: 2026-08-14
    title: Core policy set published
    summary: Organisation-wide information security and data protection policies issued and assigned for annual review.
contacts:
  email: compliance@and-element.com
  sla: Trust and security enquiries within 1 business day; data-subject requests within one month
  officeHours: UK business hours (Mon–Fri)
faqs:
  - question: Are you Cyber Essentials / IASME certified?
    answer: Yes. We hold Cyber Essentials and IASME Cyber Assurance. Certificates are publicly verifiable via the IASME / Blockmark registry links on this trust center.
  - question: Do you sign Data Processing Agreements?
    answer: Yes. For client application hosting we act as processor under a contract or DPA with documented instructions. For our own business data we are the controller. Major cloud processors are engaged on their published processor terms.
  - question: Where is data stored?
    answer: We prefer UK/EEA hosting where available. Processors may also process in the United States and EEA. Transfers use UK adequacy regulations, the UK Extension to the EU-US Data Privacy Framework, the UK IDTA, or the UK Addendum to the EU SCCs as applicable.
  - question: How do individuals exercise their rights?
    answer: Contact compliance@and-element.com, telephone or post as set out in our privacy notice. We respond without undue delay and within one month. Complaints can be escalated to the ICO.
  - question: Do you store payment card data?
    answer: No. Where sites we build use Stripe Checkout, card details are entered on Stripe’s hosted page and are not transmitted to or stored in our systems. The client owns the merchant account.
  - question: Who is accountable for security and data protection?
    answer: Luke Brown (CEO) is accountable at board level. Jack Kent (Lead Engineer) manages day-to-day information security and data protection and reports to Joe Methven (COO). We are not required to appoint a statutory DPO.
subprocessors:
  - name: Google Workspace
    category: Identity and collaboration
    location: United Kingdom / United States / EEA
    logo: https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/google.svg
    description: Business email, documents, file storage, SSO and controlled sharing.
  - name: Google Cloud Platform
    category: Cloud infrastructure
    location: United Kingdom / United States / EEA
    logo: https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googlecloud.svg
    description: Cloud infrastructure, applications, storage and IAM.
  - name: Amazon Web Services
    category: Cloud infrastructure
    location: United Kingdom / United States / EEA
    logo: https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/amazonaws.svg
    description: Cloud infrastructure, hosting, data storage and related platform services.
  - name: Railway
    category: Application hosting
    location: United States / EEA
    logo: https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/railway.svg
    description: Application hosting, deployment, databases and associated infrastructure.
  - name: Cloudflare
    category: Security and edge
    location: Global edge / United States
    logo: https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/cloudflare.svg
    description: DNS, CDN, security and Zero Trust access to internal systems.
  - name: MongoDB Atlas
    category: Database
    location: United Kingdom / United States / EEA
    logo: https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mongodb.svg
    description: Managed database hosting for selected applications.
  - name: GitHub
    category: Source control and CI
    location: United States
    logo: https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg
    description: Source code repositories and development workflows.
  - name: Slack
    category: Internal communications
    location: United States / EEA
    logo: https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/slack.svg
    description: Internal messaging and incident escalation channels.
  - name: Stripe
    category: Payments
    location: United States / EEA
    logo: https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/stripe.svg
    description: Hosted Checkout for client sites; card data does not touch Element systems.
  - name: Sentry
    category: Application monitoring
    location: United States / EEA
    logo: https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/sentry.svg
    description: Error monitoring and performance observability for applications.
  - name: Bitdefender
    category: Endpoint protection
    location: European Union
    logo: https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/bitdefender.svg
    description: Endpoint malware protection on managed devices.
  - name: Jamf
    category: Device management
    location: United States / EEA
    logo: https://www.vectorlogo.zone/logos/jamf/jamf-icon.svg
    description: Mobile device management for company laptops and mobiles (inventory, lock, wipe).
  - name: OpenAI
    category: Artificial intelligence
    location: United States
    logo: https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/openai.svg
    description: Model inference where used in product or internal tooling under processor terms.
  - name: Anthropic
    category: Artificial intelligence
    location: United States
    logo: https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/anthropic.svg
    description: Model inference where used in product or internal tooling under processor terms.
`;

export type SafeParseResult =
  | { ok: true; data: TrustCenterConfig }
  | { ok: false; error: string };

export function safeParseTrustCenter(yamlString: string): SafeParseResult {
  try {
    const raw =
      yaml.load(yamlString, { schema: yaml.JSON_SCHEMA }) ?? {};
    const data = trustCenterSchema.parse(raw);
    return { ok: true, data };
  } catch (error) {
    const message =
      error instanceof ZodError
        ? error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join(" | ")
        : error instanceof Error
          ? error.message
          : "Unable to read the YAML.";
    return { ok: false, error: message };
  }
}
