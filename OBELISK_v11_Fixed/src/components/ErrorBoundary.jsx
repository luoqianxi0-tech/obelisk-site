import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#fafafa] via-[#f0f0f0] to-[#e5e5e5] flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white/70 backdrop-blur-xl border border-black/5 shadow-sm rounded-lg p-8">
            <div className="w-12 h-12 border-2 border-black/20 rounded-full flex items-center justify-center mb-6">
              <span className="text-xl font-mono font-bold">!</span>
            </div>
            <h1 className="text-2xl font-light tracking-wide mb-2">系统错误</h1>
            <div className="h-[1px] w-16 bg-black/20 mb-6" />
            <p className="text-sm text-black/60 mb-2">抱歉，应用遇到了问题，请尝试刷新页面。</p>
            {this.state.error && (
              <div className="mt-6 p-4 bg-black/5 rounded border border-black/5">
                <div className="text-xs font-mono text-black/50 mb-2">错误信息：</div>
                <div className="text-sm font-mono text-black/80 break-all whitespace-pre-wrap">
                  {this.state.error.toString()}
                </div>
              </div>
            )}
            <div className="flex gap-3 mt-8">
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 bg-black text-white text-sm hover:bg-black/80 transition-colors"
              >
                刷新页面
              </button>
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 border border-black/10 text-sm hover:bg-black/5 transition-colors"
              >
                重置状态
              </button>
            </div>
            <div className="mt-8 pt-6 border-t border-black/5">
              <p className="text-xs text-black/40 leading-relaxed">
                如果问题持续存在，请按 F12 打开开发者工具查看控制台错误信息。
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}