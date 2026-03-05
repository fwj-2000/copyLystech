import { generatePdfById } from './pdf';
// import { notification } from 'ant-design-vue';

/** 队列任务状态枚举 */
enum QUEUE_STATUS_ENUM {
  等待 = 'waiting',
  运行中 = 'running',
  完成 = 'complete',
  失败 = 'failed',
}

type TQueueItem = {
  id: string;
  status?: QUEUE_STATUS_ENUM;
};

/** 生成PDF队列的类 */
export class GeneratePDFQueue {
  /** 总队列 */
  private queue: Array<TQueueItem> = [];
  /** 当前正在执行的任务 */
  private currentTask: TQueueItem | null = null;
  /** 生成一份PDF的预估时间，单位：秒 */
  private ESTIMATED_EXECUTION_TIME = 10;
  /** 创建消息的`key` */
  // private readonly MESSAGE_KEY = 'generate-pdf-queue-message';

  constructor(list: Array<TQueueItem>) {
    this.queue = Array.isArray(list) ? [...list] : [];
  }

  /**
   * 添加任务
   * @param props
   */
  add(list: Array<TQueueItem>) {
    this.queue.push(...list);
    return this.run();
  }

  /**
   * 删除任务
   * @param index
   */
  remove(index: number) {
    if (this.currentTask === this.queue[index]) {
      return false;
    }
    this.queue.splice(index, 1);
    this._openMessage();
    return true;
  }

  /**
   * 重新开始任务
   * @param index
   */
  async restart(index: number) {
    if (this.currentTask === this.queue[index] || !this.queue[index]) {
      return false;
    }
    const [task] = this.queue.splice(index, 1);
    task.status = QUEUE_STATUS_ENUM.等待;
    this.queue.push(task);
    return this.run();
  }

  /** 启用任务执行 */
  async run() {
    if (this.currentTask) {
      return Promise.reject('当前任务正在执行中，请勿重复执行！');
    }
    const task = this.queue.find(item => !item.status || item.status === 'waiting');
    if (!task) {
      this._removeWindowEvents();
      // 当前无可执行的任务
      return Promise.resolve();
    }
    this.currentTask = task;
    this._addWindowEvents();
    return this._run(task);
  }

  /** 执行具体任务 */
  private async _run(task: TQueueItem) {
    this._openMessage();
    task.status = QUEUE_STATUS_ENUM.运行中;
    return generatePdfById(task.id)
      .then(res => {
        task.status = QUEUE_STATUS_ENUM.完成;
        return Promise.resolve(res);
      })
      .catch(e => {
        task.status = QUEUE_STATUS_ENUM.失败;
        return Promise.reject(e);
      })
      .finally(() => {
        this._openMessage();
        return this._executeNextTask();
      });
  }

  /** 执行下一个任务 */
  private _executeNextTask() {
    this.currentTask = null;
    return this.run();
  }

  /** 打开或者更改消息提示 */
  private _openMessage() {
    // notification.open({
    //   key: this.MESSAGE_KEY,
    //   message: `message: ${this.queue.length}`,
    //   description: 'description',
    //   type: 'info',
    //   duration: null
    // });
  }

  /** 页面关闭前 - 创建消息提示 */
  private _createMessage(event: Event) {
    event.preventDefault();
    const count = this.queue.filter(el => el.status === QUEUE_STATUS_ENUM.等待 || el.status === QUEUE_STATUS_ENUM.运行中).length;
    const message = `还有${count}份PDF文件正在生成，预计还需${count * this.ESTIMATED_EXECUTION_TIME}，是否仍要关闭前端页面 ？`;
    event.returnValue = message;
    return message;
  }

  /** 页面关闭前 - 事件监听 */
  private _addWindowEvents() {
    window.addEventListener('beforeunload', this._createMessage);
  }

  /** 页面关闭前 - 取消事件监听 */
  private _removeWindowEvents() {
    window.removeEventListener('beforeunload', this._createMessage);
  }
}
