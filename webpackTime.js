class MeasureBuildTimePlugin {
  constructor() {
    this.startTime = Date.now();
  }

  apply(compiler) {
    // 在整个构建过程完成时输出总时间
    compiler.hooks.done.tap("MeasureBuildTimePlugin", () => {
        const endTime = Date.now();
        const totalBuildTime = endTime - this.startTime;
        console.log('\n----------------------------');
        console.log(`🚀 构建时间: ${totalBuildTime} 毫秒`);
        console.log('----------------------------\n');
    });
  }
}

module.exports = MeasureBuildTimePlugin;