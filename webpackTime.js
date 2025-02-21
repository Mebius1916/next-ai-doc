class MeasureBuildTimePlugin {
  constructor() {
    this.startTime = Date.now();
    this.isFirstEmit = true;
  }

  apply(compiler) {
    // 在整个构建过程完成时输出总时间
    compiler.hooks.done.tap("MeasureBuildTimePlugin", () => {
      if (this.isFirstEmit) {
        const endTime = Date.now();
        const totalBuildTime = endTime - this.startTime;
        console.log('\n----------------------------');
        console.log(`🚀 总构建时间: ${totalBuildTime} 毫秒`);
        console.log('----------------------------\n');
        this.isFirstEmit = false;
      }
    });
  }
}

module.exports = MeasureBuildTimePlugin;