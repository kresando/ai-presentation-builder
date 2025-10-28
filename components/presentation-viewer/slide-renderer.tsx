import React from "react";
import { cn } from "@/lib/utils";
import { getTheme, applyThemeVariables, type PresentationTheme } from "./themes";

interface SlideContent {
  text?: string;
  bulletPoints?: string[];
  image?: string;
  layout?: string;
  speakerNotes?: string;
}

interface SlideRendererProps {
  title: string;
  content: SlideContent;
  type: "title" | "content" | "bullet-points" | "image";
  theme?: string;
  className?: string;
  isEditing?: boolean;
  onTitleChange?: (title: string) => void;
  onContentChange?: (content: SlideContent) => void;
}

export function SlideRenderer({
  title,
  content,
  type,
  theme = "modern",
  className,
  isEditing = false,
  onTitleChange,
  onContentChange,
}: SlideRendererProps) {
  const themeConfig = getTheme(theme);
  const themeStyles = applyThemeVariables(themeConfig);

  const handleTitleChange = (newTitle: string) => {
    if (isEditing && onTitleChange) {
      onTitleChange(newTitle);
    }
  };

  const handleContentChange = (newContent: Partial<SlideContent>) => {
    if (isEditing && onContentChange) {
      onContentChange({ ...content, ...newContent });
    }
  };

  const renderTitleSlide = () => (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
      <h1
        className={cn(
          "text-5xl md:text-6xl font-bold leading-tight",
          themeConfig.fonts.heading
        )}
        style={{
          color: themeConfig.colors.text,
          fontFamily: themeConfig.fonts.heading
        }}
      >
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="bg-transparent border-none outline-none text-center w-full"
            style={{
              color: themeConfig.colors.text,
              fontFamily: themeConfig.fonts.heading
            }}
            placeholder="Presentation title"
          />
        ) : (
          title
        )}
      </h1>
      {(content.text || isEditing) && (
        <p
          className={cn(
            "text-xl md:text-2xl max-w-3xl",
            themeConfig.fonts.body
          )}
          style={{
            color: themeConfig.colors.text,
            fontFamily: themeConfig.fonts.body,
            opacity: 0.8
          }}
        >
          {isEditing ? (
            <textarea
              value={content.text || ""}
              onChange={(e) => handleContentChange({ text: e.target.value })}
              className="bg-transparent border-none outline-none text-center resize-none w-full"
              style={{
                color: themeConfig.colors.text,
                fontFamily: themeConfig.fonts.body
              }}
              placeholder="Subtitle or description"
              rows={2}
            />
          ) : (
            content.text
          )}
        </p>
      )}
    </div>
  );

  const renderContentSlide = () => (
    <div className="flex flex-col h-full space-y-8">
      <h2
        className={cn(
          "text-3xl md:text-4xl font-bold",
          themeConfig.fonts.heading
        )}
        style={{
          color: themeConfig.colors.text,
          fontFamily: themeConfig.fonts.heading
        }}
      >
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="bg-transparent border-none outline-none w-full"
            style={{
              color: themeConfig.colors.text,
              fontFamily: themeConfig.fonts.heading
            }}
            placeholder="Slide title"
          />
        ) : (
          title
        )}
      </h2>
      {(content.text || isEditing) && (
        <div className="flex-1 flex items-center">
          <p
            className={cn(
              "text-lg md:text-xl leading-relaxed max-w-4xl",
              themeConfig.fonts.body
            )}
            style={{
              color: themeConfig.colors.text,
              fontFamily: themeConfig.fonts.body,
              lineHeight: 1.7
            }}
          >
            {isEditing ? (
              <textarea
                value={content.text || ""}
                onChange={(e) => handleContentChange({ text: e.target.value })}
                className="bg-transparent border-none outline-none resize-none w-full h-full"
                style={{
                  color: themeConfig.colors.text,
                  fontFamily: themeConfig.fonts.body
                }}
                placeholder="Slide content"
                rows={8}
              />
            ) : (
              content.text
            )}
          </p>
        </div>
      )}
    </div>
  );

  const renderBulletPointsSlide = () => (
    <div className="flex flex-col h-full space-y-8">
      <h2
        className={cn(
          "text-3xl md:text-4xl font-bold",
          themeConfig.fonts.heading
        )}
        style={{
          color: themeConfig.colors.text,
          fontFamily: themeConfig.fonts.heading
        }}
      >
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="bg-transparent border-none outline-none w-full"
            style={{
              color: themeConfig.colors.text,
              fontFamily: themeConfig.fonts.heading
            }}
            placeholder="Slide title"
          />
        ) : (
          title
        )}
      </h2>
      <div className="flex-1 flex items-center">
        <div className="space-y-4 max-w-4xl">
          {(content.bulletPoints || []).map((point, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div
                className="flex-shrink-0 w-2 h-2 rounded-full mt-2"
                style={{ backgroundColor: themeConfig.colors.accent }}
              />
              {isEditing ? (
                <input
                  type="text"
                  value={point}
                  onChange={(e) => {
                    const newBulletPoints = [...(content.bulletPoints || [])];
                    newBulletPoints[index] = e.target.value;
                    handleContentChange({ bulletPoints: newBulletPoints });
                  }}
                  className="bg-transparent border-none outline-none flex-1"
                  style={{
                    color: themeConfig.colors.text,
                    fontFamily: themeConfig.fonts.body
                  }}
                  placeholder="Bullet point"
                />
              ) : (
                <p
                  className={cn(
                    "text-lg md:text-xl",
                    themeConfig.fonts.body
                  )}
                  style={{
                    color: themeConfig.colors.text,
                    fontFamily: themeConfig.fonts.body
                  }}
                >
                  {point}
                </p>
              )}
            </div>
          ))}
          {isEditing && (
            <button
              onClick={() => {
                const newBulletPoints = [...(content.bulletPoints || []), ""];
                handleContentChange({ bulletPoints: newBulletPoints });
              }}
              className="text-lg border-2 border-dashed rounded-lg p-2 w-full text-center"
              style={{
                borderColor: themeConfig.colors.muted,
                color: themeConfig.colors.text,
                opacity: 0.6
              }}
            >
              + Add bullet point
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderImageSlide = () => (
    <div className="flex flex-col h-full space-y-6">
      <h2
        className={cn(
          "text-3xl md:text-4xl font-bold",
          themeConfig.fonts.heading
        )}
        style={{
          color: themeConfig.colors.text,
          fontFamily: themeConfig.fonts.heading
        }}
      >
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="bg-transparent border-none outline-none w-full"
            style={{
              color: themeConfig.colors.text,
              fontFamily: themeConfig.fonts.heading
            }}
            placeholder="Slide title"
          />
        ) : (
          title
        )}
      </h2>

      <div className="flex-1 flex items-center justify-center">
        {content.image ? (
          <div className="max-w-4xl w-full">
            <img
              src={content.image}
              alt={title}
              className="w-full h-auto rounded-lg object-cover"
              style={{
                boxShadow: themeConfig.styles,
                borderRadius: themeConfig.styles.borderRadius
              }}
            />
            {content.text && (
              <p
                className={cn(
                  "text-lg mt-4 text-center",
                  themeConfig.fonts.body
                )}
                style={{
                  color: themeConfig.colors.text,
                  fontFamily: themeConfig.fonts.body,
                  opacity: 0.8
                }}
              >
                {isEditing ? (
                  <textarea
                    value={content.text}
                    onChange={(e) => handleContentChange({ text: e.target.value })}
                    className="bg-transparent border-none outline-none text-center resize-none w-full"
                    style={{
                      color: themeConfig.colors.text,
                      fontFamily: themeConfig.fonts.body
                    }}
                    placeholder="Image caption"
                    rows={2}
                  />
                ) : (
                  content.text
                )}
              </p>
            )}
          </div>
        ) : (
          <div
            className="max-w-4xl w-full h-64 rounded-lg flex items-center justify-center border-2 border-dashed"
            style={{
              borderColor: themeConfig.colors.muted,
              backgroundColor: themeConfig.colors.secondary
            }}
          >
            <p
              className="text-lg"
              style={{
                color: themeConfig.colors.text,
                opacity: 0.6
              }}
            >
              {isEditing ? (
                <input
                  type="text"
                  value={content.image || ""}
                  onChange={(e) => handleContentChange({ image: e.target.value })}
                  className="bg-transparent border-none outline-none text-center"
                  style={{
                    color: themeConfig.colors.text
                  }}
                  placeholder="Enter image URL"
                />
              ) : (
                "No image specified"
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderSlideContent = () => {
    switch (type) {
      case "title":
        return renderTitleSlide();
      case "content":
        return renderContentSlide();
      case "bullet-points":
        return renderBulletPointsSlide();
      case "image":
        return renderImageSlide();
      default:
        return renderContentSlide();
    }
  };

  return (
    <div
      className={cn(
        "w-full h-full p-8 md:p-12 rounded-lg transition-all duration-300",
        className
      )}
      style={{
        ...themeStyles,
        backgroundColor: themeConfig.colors.background,
        boxShadow: themeConfig.styles.shadow,
      }}
    >
      {renderSlideContent()}
    </div>
  );
}