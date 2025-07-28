import axios, { AxiosInstance } from 'axios'
import Bottleneck from 'bottleneck'
import Leads from './Leads'
import Companies from './Companies'
import Contacts from './Contacts'
import Users from './Users'
import Pipelines from './Pipelines'
import LossReasons from './LossReason'

export default class Amo {
  public instance: AxiosInstance
  private limiter: Bottleneck
  constructor(
    private baseURL: string,
    private token: string,
    private options?: { rps?: number }
  ) {
    this.limiter = new Bottleneck({
      minTime: 1000 / Math.ceil(this.options?.rps || 6),
      maxConcurrent: 1
    })
    this.instance = axios.create({
      baseURL: this.baseURL,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(async (config) => {
      return this.limiter.schedule(async () => config)
    })
  }

  public leads = new Leads(this)
  public contacts = new Contacts(this)
  public companies = new Companies(this)
  public pipelines = new Pipelines(this)
  public users = new Users(this)
  public loss_reasons = new LossReasons(this)
}
