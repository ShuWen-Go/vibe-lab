<html style="margin:0;padding:0;">
<title>Git 四层结构流程图（零基础版）</title>
<div style="width:100%;box-sizing:border-box;font-family:-apple-system,'Segoe UI','Microsoft YaHei',sans-serif;padding:20px;background:#fafbfc;color:#222;">
  <div style="max-width:760px;margin:0 auto;">

    <h2 style="margin:0 0 4px;font-size:22px;">Git 四层：你的改动怎么一步步"送出去"</h2>
    <p style="margin:0 0 18px;color:#666;font-size:14px;">比喻贯穿全程：<b>改稿 → 挑出来 → 自己存档 → 寄给同事</b>。不用记术语，先看懂流程。</p>

    <!-- 流水线：四个层级，纵向排列 -->
    <div style="display:flex;flex-direction:column;gap:0;">

      <!-- 1 工作区 -->
      <div style="display:flex;align-items:stretch;background:#fff;border:2px solid #4a90d9;border-radius:12px;overflow:hidden;">
        <div style="flex:0 0 56px;background:#4a90d9;color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;">1</div>
        <div style="flex:1;padding:14px 16px;">
          <div style="font-size:13px;color:#4a90d9;font-weight:700;letter-spacing:1px;">工作区</div>
          <div style="font-size:18px;font-weight:700;margin:2px 0 6px;">摊在桌上、正在改的草稿</div>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#444;">就是你屏幕上打开、正在编辑的那个文件夹。你敲键盘改的每一行代码、每一个文件，都先落在这里。</p>
        </div>
      </div>

      <!-- 箭头 add -->
      <div style="display:flex;align-items:center;padding:6px 0;">
        <div style="flex:0 0 56px;display:flex;justify-content:center;">
          <div style="width:2px;height:28px;background:#43a047;position:relative;">
            <div style="position:absolute;bottom:-2px;left:50%;transform:translateX(-50%);border:6px solid transparent;border-top:8px solid #43a047;border-bottom:none;"></div>
          </div>
        </div>
        <div style="flex:1;padding-left:8px;">
          <span style="display:inline-block;background:#43a047;color:#fff;font-size:13px;font-weight:700;padding:2px 8px;border-radius:4px;">git add</span>
          <span style="font-size:14px;color:#2e7d32;margin-left:6px;">＝把"这次想一起提交的改动"挑出来，放进购物车</span>
        </div>
      </div>

      <!-- 2 暂存区 -->
      <div style="display:flex;align-items:stretch;background:#fff;border:2px solid #43a047;border-radius:12px;overflow:hidden;">
        <div style="flex:0 0 56px;background:#43a047;color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;">2</div>
        <div style="flex:1;padding:14px 16px;">
          <div style="font-size:13px;color:#2e7d32;font-weight:700;letter-spacing:1px;">暂存区</div>
          <div style="font-size:18px;font-weight:700;margin:2px 0 6px;">购物车 / 待提交清单</div>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#444;">你用 <b>git add</b> 挑中的改动暂时堆在这里。还没正式存档，只是"我打算把这几页订在一起"。</p>
        </div>
      </div>

      <!-- 箭头 commit -->
      <div style="display:flex;align-items:center;padding:6px 0;">
        <div style="flex:0 0 56px;display:flex;justify-content:center;">
          <div style="width:2px;height:28px;background:#fb8c00;position:relative;">
            <div style="position:absolute;bottom:-2px;left:50%;transform:translateX(-50%);border:6px solid transparent;border-top:8px solid #fb8c00;border-bottom:none;"></div>
          </div>
        </div>
        <div style="flex:1;padding-left:8px;">
          <span style="display:inline-block;background:#fb8c00;color:#fff;font-size:13px;font-weight:700;padding:2px 8px;border-radius:4px;">git commit</span>
          <span style="font-size:14px;color:#e65100;margin-left:6px;">＝把购物车里的东西打包成一个版本，贴个说明，存进自己家柜子</span>
        </div>
      </div>

      <!-- 3 本地仓库 -->
      <div style="display:flex;align-items:stretch;background:#fff;border:2px solid #fb8c00;border-radius:12px;overflow:hidden;">
        <div style="flex:0 0 56px;background:#fb8c00;color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;">3</div>
        <div style="flex:1;padding:14px 16px;">
          <div style="font-size:13px;color:#e65100;font-weight:700;letter-spacing:1px;">本地仓库</div>
          <div style="font-size:18px;font-weight:700;margin:2px 0 6px;">你电脑里的归档柜</div>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#444;">每一次 <b>commit</b> 就是给当前状态拍一张快照、写上日期和说明。<b>它只存在你这台电脑上</b>，断网也能用。</p>
        </div>
      </div>

      <!-- 箭头 push -->
      <div style="display:flex;align-items:center;padding:6px 0;">
        <div style="flex:0 0 56px;display:flex;justify-content:center;">
          <div style="width:2px;height:28px;background:#00897b;position:relative;">
            <div style="position:absolute;bottom:-2px;left:50%;transform:translateX(-50%);border:6px solid transparent;border-top:8px solid #00897b;border-bottom:none;"></div>
          </div>
        </div>
        <div style="flex:1;padding-left:8px;">
          <span style="display:inline-block;background:#00897b;color:#fff;font-size:13px;font-weight:700;padding:2px 8px;border-radius:4px;">git push</span>
          <span style="font-size:14px;color:#00695c;margin-left:6px;">＝把柜子里的副本复印一份，寄到网上的共享档案室</span>
        </div>
      </div>

      <!-- 4 远程仓库 -->
      <div style="display:flex;align-items:stretch;background:#fff;border:2px solid #00897b;border-radius:12px;overflow:hidden;">
        <div style="flex:0 0 56px;background:#00897b;color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;">4</div>
        <div style="flex:1;padding:14px 16px;">
          <div style="font-size:13px;color:#00695c;font-weight:700;letter-spacing:1px;">远程仓库</div>
          <div style="font-size:18px;font-weight:700;margin:2px 0 6px;">网上的共享档案室（如 GitHub）</div>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#444;">存在公司/网络服务器上。<b>只有 push 上来的东西，同事才看得到、才拉得走。</b></p>
        </div>
      </div>

    </div>

    <!-- commit vs push 对比 -->
    <h3 style="margin:26px 0 10px;font-size:18px;">commit 和 push，到底差在哪？</h3>
    <div style="display:flex;flex-wrap:wrap;gap:12px;">

      <div style="flex:1 1 240px;background:#fff;border:2px solid #fb8c00;border-radius:12px;padding:14px 16px;">
        <div style="font-size:16px;font-weight:700;color:#e65100;margin-bottom:6px;">git commit：自己存档</div>
        <ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.7;color:#444;">
          <li>动作发生在<b>你自己的电脑</b>上，不联网也行。</li>
          <li>相当于在本子上"打个版本标记"。</li>
          <li><b>别人完全看不到</b>你改了啥。</li>
          <li>你可以连着 commit 十几次，都只存在本地。</li>
        </ul>
      </div>

      <div style="flex:1 1 240px;background:#fff;border:2px solid #00897b;border-radius:12px;padding:14px 16px;">
        <div style="font-size:16px;font-weight:700;color:#00695c;margin-bottom:6px;">git push：上传给大家</div>
        <ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.7;color:#444;">
          <li>把本地的版本<b>上传到网络服务器</b>，必须联网。</li>
          <li>相当于把存档"复印一份寄出去"。</li>
          <li><b>推上去之后，同事才能看到并下载</b>你的成果。</li>
          <li>没 push 的 commit，别人永远不知道存在过。</li>
        </ul>
      </div>

    </div>

    <div style="margin-top:16px;background:#fff8e1;border-left:4px solid #fb8c00;padding:12px 14px;border-radius:6px;font-size:14px;line-height:1.7;color:#444;">
      <b>一句话总结：</b>commit 是"保存到自己硬盘"，push 是"传到云端让别人看见"。<br>
      所以新手最常踩的坑就是：改完、commit 了，以为"已经提交了"，结果一没 push，同事那边根本看不到——你只是在自己电脑上存了个档而已。
    </div>

  </div>
</div>